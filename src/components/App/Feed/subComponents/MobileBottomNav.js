import React from 'react'
import FontIcon from 'material-ui/FontIcon'
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'
import IconLocationOn from 'material-ui/svg-icons/communication/location-on'
import List from 'material-ui/svg-icons/action/list'

const recentsIcon = <FontIcon className='material-icons'>restore</FontIcon>
const favoritesIcon = <List />
const nearbyIcon = <IconLocationOn />

/**
 * A simple example of `BottomNavigation`, with three labels and icons
 * provided. The selected `BottomNavigationItem` is determined by application
 * state (for instance, by the URL).
 */
class MobileBottomNav extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedIndex: 0
    }
    this.select = this.select.bind(this)
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
            icon={favoritesIcon}
            onTouchTap={() => this.select(0)}
          />
          <BottomNavigationItem
            label='Map'
            icon={nearbyIcon}
            onTouchTap={() => this.select(1)}
          />
        </BottomNavigation>
      </Paper>
    )
  }
}

export default MobileBottomNav
