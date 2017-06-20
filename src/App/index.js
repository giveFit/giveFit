import React from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'

import AuthService from 'utils/AuthService'
import { LOGIN_USER_WITH_AUTH0_LOCK, UPDATE_USER_QUERY } from './gql'

import Header from './Header/index'
import Footer from './Footer/index'

class App extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.onAuthenticated = this.onAuthenticated.bind(this)
    this.auth = new AuthService(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN)
    this.auth.on('authenticated', this.onAuthenticated)
    this.auth.on('error', console.log)

    this.state = {
      profile: this.auth.getProfile(),
      userId: JSON.parse(window.localStorage.getItem('scapholdUserId')),
      footerActiveTab: 'list',
    }

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

    this.props.loginUser({
      identity: identity,
      access_token: tokenPayload.accessToken,
    })
      .then((res) => {
        const scapholdUserId = res.data.loginUserWithAuth0Lock.user.id

        this.setState({
          profile: auth0Profile,
          userId: scapholdUserId,
        })

        // Cause a UI update :)
        window.localStorage.setItem('scapholdUserId', JSON.stringify(scapholdUserId))

        this.props.updateUser({
          id: scapholdUserId,
          picture: auth0Profile.picture,
          nickname: auth0Profile.nickname,
        })
      })
      .catch(err => {
        console.log(`Error updating user: ${err.message}`)
      })
  }

  renderChildren (profile, userId, footerActiveTab) {
    return React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        profile,
        userId,
        auth: this.auth,
        footerActiveTab,
      })
    })
  }

  render () {
    const { profile, userId } = this.state
    console.log('app props', this.props)

    return (
      <div id='app' className='__app__main'>
        <Header
          auth={this.auth}
          profile={profile}
        />
        <div id='body' className={`__app__body__container __${this.state.footerActiveTab}`}>
          {this.renderChildren(profile, userId, this.state.footerActiveTab)}
        </div>
        <Footer
          pathname={this.props.location.pathname}
          onTabChange={(tab) => this.setState({ footerActiveTab: tab })}
        />
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
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
  }),
)(App)

export default AppWithData
