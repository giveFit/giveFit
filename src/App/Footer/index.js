import React from 'react'
import PropTypes from 'prop-types'

import MobileBottomNav from './MobileBottomNav'
// import BottomNavigation from './BottomNavigation'

class Footer extends React.Component {
  render () {
    return (
      <div id='footer' className='__app__footer'>
        {['/', '/new-york', '/explore'].includes(this.props.pathname) && <MobileBottomNav />}
      </div>
    )
  }
}

Footer.propTypes = {
  pathname: PropTypes.string.isRequired,
}

export default Footer
