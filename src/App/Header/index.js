import React from 'react'
import PropTypes from 'prop-types'

import MainToolbar from './MainToolbar'
import LoggedInToolbar from './LoggedInToolbar'

class Header extends React.Component {
  render () {
    return (
      <div id='Header' className='__app__header'>
        {!this.props.auth.loggedIn()
          ? <MainToolbar auth={this.props.auth} />
          : <LoggedInToolbar
              auth={this.props.auth}
              userId={this.props.userId}
              profile={this.props.profile}
            />
        }
      </div>
    )
  }
}

Header.propTypes = {
  auth: PropTypes.object,
  userId: PropTypes.string,
  profile: PropTypes.object,
}

export default Header
