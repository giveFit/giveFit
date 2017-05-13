import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'

import AuthService from 'utils/AuthService'
import { LOGIN_USER_WITH_AUTH0_LOCK, UPDATE_USER_QUERY } from './gql'

import apolloConfig from '../../apolloConfig'

import Header from './Header/index'
import Footer from './Footer/index'

class App extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      profile: null,
      token: null,
      userId: null,
    }

    this.onAuthenticated = this.onAuthenticated.bind(this)
    this.auth = new AuthService(apolloConfig.auth0ClientId, apolloConfig.auth0Domain)
    this.auth.on('authenticated', this.onAuthenticated)
    this.auth.on('error', console.log)

    window.localStorage.removeItem('__find_workouts_pos')
    window.localStorage.removeItem('__find_workouts_address')
  }

  // componentDidMount(){
    // console.log('componentDidMount');
    // localStorage.setItem('userId', JSON.stringify(this.state.userId))
  // }

  onAuthenticated (auth0Profile, tokenPayload) {
    const identity = auth0Profile.identities[0]
    // updateUser/loginUser expects userId, not user_id
    identity.userId = identity.user_id
    delete identity.user_id

    this.setState({
      profile: auth0Profile,
    })

    this.props.loginUser({
      identity: identity,
      access_token: tokenPayload.accessToken,
    })
      .then(res => {
        const scapholdUserId = res.data.loginUserWithAuth0Lock.user.id
        const profilePicture =  auth0Profile.picture
        const nickname = auth0Profile.nickname
        // Cause a UI update :)
        window.localStorage.setItem('scapholdUserId', JSON.stringify(scapholdUserId))

        return this.props.updateUser({
          id: scapholdUserId,
          picture: profilePicture,
          nickname: nickname,
        })
      })
      .catch(err => {
        console.log(`Error updating user: ${err.message}`)
      })
  }

  renderChildren (profile) {
    return React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        profile,
        auth: this.auth,
      })
    })
  }

  render () {
    const profile = this.auth.getProfile()

    return (
      <div id='app' className='__app__main'>
        <Header
          auth={this.auth}
          profile={profile}
          userId={this.state.userId}
        />
        <div id='body' className='__app__body__container'>
          {this.renderChildren(profile)}
        </div>
        <Footer
          pathname={this.props.location.pathname}
        />
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired,
}

App.contextTypes = {
  router: PropTypes.object.isRequired,
}

const AppWithData = compose(
  graphql(LOGIN_USER_WITH_AUTH0_LOCK, {
    props: ({ mutate }) => ({
      loginUser: (credential) => mutate({ variables: { credential: credential } }),
    }),
  }),
  graphql(UPDATE_USER_QUERY, {
    props: ({ mutate }) => ({
      updateUser: (user) => mutate({ variables: { user: user } }),
    }),
  })
)(App)

export default AppWithData
