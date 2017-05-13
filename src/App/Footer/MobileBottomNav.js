import React from 'react'

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
    return (
      <Paper zDepth={1}>
        <BottomNavigation selectedIndex={this.state.selectedIndex}>
          <BottomNavigationItem
            label='List'
            icon={<List />}
            onTouchTap={() => this.select(0)}
          />
          <BottomNavigationItem
            label='Map'
            icon={<IconLocationOn />}
            onTouchTap={() => this.select(1)}
          />
        </BottomNavigation>
      </Paper>
    )
  }
}

export default MobileBottomNav
