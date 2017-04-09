import React from 'react'
import PropTypes from 'prop-types'

import RaisedButton from 'material-ui/RaisedButton'

import AuthService from 'utils/AuthService'
import styles from './styles.module.css'

/*
  1. Obtain access token from Facebook client SDK, send GraphQL request
  2. Store JSON Web Token (JWT) as Authorization header in HTTP requests
  3. Once logged in, send another GraphqQL request with
    access token from Google+ client SDK to link both social authentication
    credentials.
*/

export class Login extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      profile: props.auth.getProfile(),
      token: props.auth.getToken()
    }
  }
  render () {
    const { auth } = this.props

    return (
      <div className={styles.root}>
        <h2>Login</h2>
        <div>
          <RaisedButton onClick={auth.login.bind(this)}>Login</RaisedButton>
        </div>
      </div>
    )
  }
}

Login.contextTypes = {
  router: PropTypes.object
}

Login.propTypes = {
  auth: PropTypes.instanceOf(AuthService)
}

export default Login
