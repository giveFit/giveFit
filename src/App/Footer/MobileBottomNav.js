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
  constructor (props) {
    super(props)

    this.state = {
      selectedIndex: 0,
    }
  }

  select (index) {
    this.setState({ selectedIndex: index })
  };

  render () {
    const { selectedIndex } = this.state

    return (
      <Paper zDepth={1}>
        <BottomNavigation selectedIndex={selectedIndex}>
          <BottomNavigationItem

            className={selectedIndex === 0 ? '__active' : ''}
            label='Map'
            icon={<IconLocationOn />}
            onTouchTap={() => {
              this.select(0)
              this.props.onTabChange('map')
            }}
          />
          <BottomNavigationItem
            className={selectedIndex === 0 ? '__active' : ''}
            label='Activities'
            icon={<List />}
            onTouchTap={() => {
              this.select(1)
              this.props.onTabChange('list')
            }}
          />
        </BottomNavigation>
      </Paper>
    )
  }
}

MobileBottomNav.propTypes = {
  onTabChange: PropTypes.func.isRequired,
}

export default MobileBottomNav
