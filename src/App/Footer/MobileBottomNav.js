import React from 'react'
import PropTypes from 'prop-types'

import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'
import IconLocationOn from 'material-ui/svg-icons/communication/location-on'
import List from 'material-ui/svg-icons/action/list'

/**
 * A simple example of `BottomNavigation`, with three labels and icons
 * provided. The selected `BottomNavigationItem` is determined by application
 * state (for instance, by the URL).
 */
class MobileBottomNav extends React.Component {
  render () {
    const { footerActiveTab } = this.props

    return (
      <Paper zDepth={1}>
        <BottomNavigation selectedIndex={footerActiveTab === 'list' ? 0 : 1}>
          <BottomNavigationItem
            className={footerActiveTab === 'list' ? '__active' : ''}
            label='Activities'
            icon={<List />}
            onTouchTap={() => {
              this.props.onTabChange('list')
            }}
          />
          <BottomNavigationItem
            className={footerActiveTab === 'map' ? '__active' : ''}
            label='Map'
            icon={<IconLocationOn />}
            onTouchTap={() => {
              this.props.onTabChange('map')
            }}
          />
        </BottomNavigation>
      </Paper>
    )
  }
}

MobileBottomNav.propTypes = {
  onTabChange: PropTypes.func.isRequired,
  footerActiveTab: PropTypes.string.isRequired,
}

export default MobileBottomNav
