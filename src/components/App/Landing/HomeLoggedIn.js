import React from 'react'
import PropTypes from 'prop-types'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText, GridList} from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import AuthService from 'utils/AuthService'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {orange500, blue500, indigo500} from 'material-ui/styles/colors'
import CircularProgress from 'material-ui/CircularProgress'
import apolloConfig from '../../../../apolloConfig'

import FindWorkouts from './FindWorkouts'
import HomeFeed from './SubComponents/HomeFeed'
import LoggedInToolbar from '../Header/LoggedInToolbar'
import MainToolbar from '../../Home/Header/MainToolbar'
import BottomNav from './SubComponents/BottomNavigation'
import Features from './SubComponents/Features'
// import { GooglePlaceAutocomplete } from "material-ui-places";

import './styles.css'

const inlineStyles = {
  textFieldStyle: {
    color: indigo500
  },
  paper: {
    height: 100,
    width: 100,
    margin: 5,
    textAlign: 'center',
    display: 'inline-block'
  },
  button: {
    border: 'none',
    color: 'white',
    margin: '15px 32px',
    padding: '15px 32px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '24px'
  }
}

export class HomeLoggedIn extends React.Component {
  constructor (props, context) {
    console.log('HomeLoggedIn props', props)
    super(props, context)
    this.state = {
      profile: null,
      token: null,
      userId: null
    }
    this.onAuthenticated = this.onAuthenticated.bind(this)
    this.auth = new AuthService(apolloConfig.auth0ClientId, apolloConfig.auth0Domain)
    this.auth.on('authenticated', this.onAuthenticated)
    this.auth.on('error', console.log)
    localStorage.removeItem('__find_workouts_pos')
    localStorage.removeItem('__find_workouts_address')
  }

  onAuthenticated (auth0Profile, tokenPayload) {
    const identity = auth0Profile.identities[0]
    // updateUser/loginUser expects userId, not user_id
    identity.userId = identity.user_id
    delete identity.user_id
    console.log('LoggedInToolbar identity', identity)
    const that = this
    // debugger;
    this.setState({profile: auth0Profile})
    this.props.loginUser({
      identity: identity,
      access_token: tokenPayload.accessToken
    }).then(res => {
      console.log('authentication response', res)
      const scapholdUserId = res.data.loginUserWithAuth0Lock.user.id
      const profilePicture = auth0Profile.picture
      const nickname = auth0Profile.nickname
      // Cause a UI update :)
      console.log('scapholdUserId', scapholdUserId)
      localStorage.setItem('scapholdUserId', JSON.stringify(scapholdUserId))

      return that.props.updateUser({
        id: scapholdUserId,
        picture: profilePicture,
        nickname: nickname
      })
    }).catch(err => {
      console.log(`Error updating user: ${err.message}`)
    })
  }
  /* componentDidMount(){
    console.log('componentDidMount');
    localStorage.setItem('userId', JSON.stringify(this.state.userId))
  } */

  quickEnter () {
    /* I want users to be able to press the button without
    entering anything, but still have the value declaration
    below for when i do a location query */
    /* const {value} = this.refs.textbox.input; */
    this.context.router.push('/app')
  }
  handleSubmit () {
    /* I want users to be able to press the button without
    entering anything, but still have the value declaration
    below for when i do a location query */
    /* const {value} = this.refs.textbox.input; */
    const fWPosString = localStorage.getItem('__find_workouts_pos')
    const fWAddress = localStorage.getItem('__find_workouts_address')
    if (fWPosString) {
      const {lat, lng} = JSON.parse(fWPosString)
      return this.context.router.push(`/app?lat=${lat}&lng=${lng}`)
    }
    if (fWAddress) {
      return this.findWorkoutsComponent.getLatLng(fWAddress).then(results => {
        const {geometry: {location}} = results[0]
        const lat = location.lat(),
          lng = location.lng()
        this.context.router.push(`/app?lat=${lat}&lng=${lng}`)
      })
    }
    this.context.router.push(`/app`)
  }

  // Need Google maps API here
  handleAutoComplete () {
    /* this.setState({
      hintText = null;
    }) */
    new google.maps.places.Autocomplete(
    (document.getElementById('autocomplete')), {
      types: ['geocode']
    })
  }
  render () {
    // console.log('HomeLoggedIn this', this)
    const profile = this.auth.getProfile()
    // console.log('HomeLoggedIn profile', profile)
    const workouts = (!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ? this.props.data.viewer.allWorkoutGroups.edges : []
    // console.log('profile', profile);
    const listView = workouts.length ? <div className='workouts'>
    {workouts.map((item, index) => (
         <div key={index} className='workout'> {!item ||
          (<HomeFeed
            data={item.node}
         />)} </div>
    ))}
    </div> : <CircularProgress size={80} />
    return (
      <div className='root'>
      { !this.auth.loggedIn()
          ? <MainToolbar
            auth={this.props}
          />
          : <LoggedInToolbar
            auth={this.props}
            profile={profile}
            userId={this.state.userId}
          />
      }
      <div className='banner'>
      <div className='bannerInner'>
        <h1 className='heading'>Find Your Fitness Tribe</h1>
        <h3 className='subHeading'>Connect with free fitness groups right in your community</h3>
        <Card className='bannerCard'>
          <CardText>
            <FindWorkouts ref={node => this.findWorkoutsComponent = node}/>
            <RaisedButton
              label="Find My Tribe"
              secondary={true}
              className='submitButton'
              onTouchTap={() => this.handleSubmit()}
              // style={inlineStyles.button}
            />
          </CardText>
        </Card>
        </div>
      </div>
      {/* Using most simple landing page until adding more design */}
      {/* <h2 className='featuredWorkouts'>
          <CardText>
            Our community partners
          </CardText>
          <Paper style={inlineStyles.paper} zDepth={1} />
          <Paper style={inlineStyles.paper} zDepth={2} />
          <Paper style={inlineStyles.paper} zDepth={1} />
          <Paper style={inlineStyles.paper} zDepth={2} />
          <Paper style={inlineStyles.paper} zDepth={1} />
          <Paper style={inlineStyles.paper} zDepth={2} />
          <Paper style={inlineStyles.paper} zDepth={1} />
          <CardText>
            GiveFit takes the pressure out of working out. We help you find likeminded "tribes"
            who happen to live nearby.
          </CardText>
        <CardText>
          GiveFit takes the pressure out of working out. We help you find likeminded "tribes"
          who happen to live nearby.
        </CardText>
        <Paper style={inlineStyles.paper} zDepth={1} />
          <Paper style={inlineStyles.paper} zDepth={2} />
          <Paper style={inlineStyles.paper} zDepth={1} />
          <Paper style={inlineStyles.paper} zDepth={2} />
          <Paper style={inlineStyles.paper} zDepth={1} />
          <Paper style={inlineStyles.paper} zDepth={2} />
          <Paper style={inlineStyles.paper} zDepth={1} />
        <div className='searchAgain'>
          <div className='bannerInner'>
            <h1 className='heading'>Find Your Fitness Tribe</h1>
            <h3 className='subHeading'>Connect with fitness groups right in your community</h3>
            <Card className='bannerCard'>
              <CardText>
                <FindWorkouts ref={node=>this.findWorkoutsComponent = node}/>
                <RaisedButton label="Find My Tribe" secondary={true} className='submitButton' onTouchTap={()=>this.handleSubmit()} />
              </CardText>
            </Card>
          </div>
        </div>

      </h2> */}
      </div>
    )
  }
}

HomeLoggedIn.contextTypes = {
  router: PropTypes.object
}

// Get some WorkoutGroups
const GET_THROUGH_VIEWER = gql`
  query GetThroughViewer($first: Int) {
    viewer {
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
    user{
      id
      username
    }
    }
  }
`
const UPDATE_USER_QUERY = gql`
mutation UpdateUser($user: UpdateUserInput!) {
  updateUser(input: $user) {
    changedUser {
      id
      username
      picture
    }
  }
}
`

const HomeLoggedInWithData = compose(
  graphql(GET_THROUGH_VIEWER, {
    options: (props) => ({
      variables: { first: FIRST }
    })
  }),
  /* graphql(LOGGED_IN_USER, {
    props: ({ data }) =>  ({
      loggedInUser: data.viewer ? data.viewer.user : null
    })
  }), */
  graphql(LOGIN_USER_WITH_AUTH0_LOCK, {
    props: ({ mutate }) => ({
      loginUser: (credential) => mutate({ variables: { credential: credential } })
    })
  }),
  graphql(UPDATE_USER_QUERY, {
    props: ({ mutate }) => ({
      updateUser: (user) => mutate({ variables: { user: user }})
    })
  })
)(HomeLoggedIn)

export default HomeLoggedInWithData
