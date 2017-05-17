import React from 'react'
import PropTypes from 'prop-types'

import MainToolbar from './MainToolbar'
import LoggedInToolbar from './LoggedInToolbar'

class Header extends React.Component {
  render () {
    return (
      <div id='Header' className='__app__header'>
        {this.props.auth.loggedIn() && this.props.profile
          ? <LoggedInToolbar
              auth={this.props.auth}
              profile={this.props.profile}
            />
          : <MainToolbar auth={this.props.auth} />
        }
      </div>
    )
  }
}

Header.propTypes = {
  auth: PropTypes.object,
  profile: PropTypes.object,
}

export default Header
