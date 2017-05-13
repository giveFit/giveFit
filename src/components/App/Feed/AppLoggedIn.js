import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import GridContainer from './GridContainer'
import LoggedInToolbar from '../Header/LoggedInToolbar'
import apolloConfig from '../../../../apolloConfig'

import AuthService from 'utils/AuthService'
import MainToolbar from '../../Home/Header/MainToolbar'
import MobileBottomNav from './subComponents/MobileBottomNav'

import './styles.css'

// Get some WorkoutGroups
const GET_THROUGH_VIEWER = gql`
query GetThroughViewer($first: Int) {
  viewer {
    allWorkouts {
      edges {
        node {
          id
          parkId
          title
          description
          Workout {
            nickname
            username
            picture
          }
        }
      }
    }
    allWorkoutGroups(first: $first) {
      edges {
        node {
          id
          image
          title
          lat
          lng
          avatar
          contentSnippet
        }
      }
    }
  }
}
`

// How many WorkoutGroups to return
const FIRST = 8

const LOGIN_USER_WITH_AUTH0_LOCK = gql`
mutation loginUserWithAuth0Lock($credential: LoginUserWithAuth0LockInput!) {
  loginUserWithAuth0Lock(input: $credential) {
    user {
      id
      username
    }
   }
}`

const UPDATE_USER_QUERY = gql`
mutation UpdateUser($user: UpdateUserInput!) {
  updateUser(input: $user) {
    changedUser {
      id
      username
      picture
    }
  }
}`

class AppLoggedIn extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      profile: null,
      token: null,
      user: null,
      loggedInToolbar: false,
    }

    this.auth = new AuthService(apolloConfig.auth0ClientId, apolloConfig.auth0Domain)
    this.onAuthenticated = this.onAuthenticated.bind(this)
    this.auth.on('authenticated', this.onAuthenticated)
    this.auth.on('error', console.log)
  }

  onAuthenticated (auth0Profile, tokenPayload) {
    const identity = auth0Profile.identities[0]

    // updateUser/loginUser expects userId, not user_id
    identity.userId = identity.user_id
    delete identity.user_id
    console.log('auth0Profile', auth0Profile)

    // debugger;
    this.props.loginUser({
      identity: identity,
      access_token: tokenPayload.accessToken,
    }).then(res => {
      const scapholdUserId = res.data.loginUserWithAuth0Lock.user.id
      const profilePicture = auth0Profile.picture
      const nickname = auth0Profile.nickname
      // Cause a UI update :)
      // this.setState({userId: scapholdUserId});
      window.localStorage.setItem('scapholdUserId', JSON.stringify(scapholdUserId))

      return this.props.updateUser({
        id: scapholdUserId,
        picture: profilePicture,
        nickname: nickname,
      })
    }).catch(err => {
      console.log(`Error updating user: ${err.message}`)
    })
  }

  render () {
    const profile = this.auth.getProfile()
    let latLng = null

    if (this.props.location.query.lat && this.props.location.query.lng) {
      latLng = {
        lat: parseFloat(this.props.location.query.lat),
        lng: parseFloat(this.props.location.query.lng),
      }
    }

    return (
      <div className='__app__main'>
        <div className='__app__header'>
          {!this.auth.loggedIn()
            ? <MainToolbar auth={this.props} />
            : <LoggedInToolbar auth={this.props} profile={profile}/>
          }
        </div>
        <GridContainer
          latLng={latLng}
          onPlaceSelect={(place) => {
            this.props.data.refetch({
              latLng: place.address,
            })

            return null
          }}
          profile={profile}
          user={this.state.user}
          workoutGroups={(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ? this.props.data.viewer.allWorkoutGroups.edges : []}
          workouts={(!this.props.data.loading && this.props.data.viewer.allWorkouts.edges) ? this.props.data.viewer.allWorkouts.edges : []}
          markers={(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges)
            ? this.props.data.viewer.allWorkoutGroups.edges.map((i, index) => ({
              // title : i.node.title,
              position: {
                lat: parseFloat(i.node.lat),
                lng: parseFloat(i.node.lng),
              },
            }))
            : []
          }
        />
        <MobileBottomNav className='bottomNav' />
      </div>
    )
  }
}

AppLoggedIn.propTypes = {
  auth: PropTypes.instanceOf(AuthService),
  loginUser: PropTypes.func.isRequired,
}

const AppLoggedInWithData = compose(
  graphql(GET_THROUGH_VIEWER, {
    options: (props) => ({
      variables: { first: FIRST },
    }),
  }),
  graphql(LOGIN_USER_WITH_AUTH0_LOCK, {
    props: ({ mutate }) => ({
      loginUser: (credential) => mutate({ variables: { credential: credential } }),
    }),
  }),
  graphql(UPDATE_USER_QUERY, {
    props: ({ mutate }) => ({
      updateUser: (user) => mutate({variables: { user: user }}),
    }),
  })
)(AppLoggedIn)

export default AppLoggedInWithData
