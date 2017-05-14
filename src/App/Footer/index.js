import React from 'react'
import PropTypes from 'prop-types'

import MobileBottomNav from './MobileBottomNav'
// import BottomNavigation from './BottomNavigation'

class Footer extends React.Component {
  render () {
    return (
      <div id='footer' className='__app__footer'>
        {this.props.pathname === '/explore' && <MobileBottomNav />}
      </div>
    )
  }
}

Footer.propTypes = {
  pathname: PropTypes.string.isRequired,
}

export default Footer
