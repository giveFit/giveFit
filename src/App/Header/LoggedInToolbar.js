import React from 'react'
import PropTypes from 'prop-types'

import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more'
import Hamburger from 'material-ui/svg-icons/navigation/menu'
import { Link, hashHistory } from 'react-router'
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'
import { MenuItem, FlatButton, Avatar } from 'material-ui'

import './LoggedInToolbar.css'

class LoggedInToolbar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: 3,
      open: false,
    }
  }

  handleChange (event, index, value) {
    this.setState({value})
  };

  handleToggle () {
    this.setState({ open: !this.state.open })
  }

  handleClose () {
    this.setState({ open: false })
  }

  handleTouchTap () {
    this.context.router.push('/')
  }

  logout () {
    this.props.auth.logout()
    this.context.router.push('/')
  }
  goToWorkouts () {
    hashHistory.push('/explore')
  }
  render () {
    const { profile } = this.props

    return (
      <div>
        <Toolbar>
          <ToolbarGroup>
            <ToolbarTitle
              className='title'
              text='GiveFit'
              onClick={() => this.context.router.push('/')}
            />
          </ToolbarGroup>
          <ToolbarGroup >
            <Avatar
              className='iconMenu avatar'
              src={profile.picture}
              onClick={() => this.context.router.push('/profile')}
            />
            <IconMenu
              className='iconMenu'
              iconButtonElement={
                <IconButton touch={true} onTouchTap={this.handleToggle.bind(this)}>
                  <Hamburger />
                </IconButton>
              }
            >
              <MenuItem
                primaryText="Workout Classes"
                onTouchTap={this.handleClose.bind(this)}
                onClick={() => this.context.router.push('/')}
              />
              <MenuItem
                primaryText="Profile"
                onTouchTap={this.handleClose.bind(this)}
                onClick={() => this.context.router.push('/profile')}
              />
              <MenuItem
                onTouchTap={this.handleClose.bind(this)}
                primaryText='API'
              >
                <Link to='https://graphql-docs.com/docs/User/?graphqlUrl=https://us-west-2.api.scaphold.io/graphql/newGiveFitAlias' target='_blank' />
              </MenuItem>
              <MenuItem
                onTouchTap={this.handleClose.bind(this)}
                onClick={() => this.logout()}
                primaryText='Logout'
              />
            </IconMenu>
          </ToolbarGroup>
          <ToolbarGroup className='onlyLargeScreens'>
            <FlatButton label='Workout Classes' onClick={() => this.context.router.push('/')} />
            <FlatButton
              className='onlyLargeScreens'
              containerElement={<Link to='https://graphql-docs.com/docs/User/?graphqlUrl=https://us-west-2.api.scaphold.io/graphql/newGiveFitAlias' target='_blank' />}
              label='API'
            />
            <FlatButton label='City Leaderboard' onClick={() => this.context.router.push('/city-leaderboard')} />
            <Avatar
              className='avatar'
              src={profile.picture}
              onClick={() => this.context.router.push('/profile')}
            />
            <IconMenu
              iconButtonElement={
                <IconButton touch={true}>
                  <NavigationExpandMoreIcon />
                </IconButton>
              }
            >
              <MenuItem
                primaryText="Profile"
                onTouchTap={this.handleClose.bind(this)}
                onClick={() => this.context.router.push('/profile')}
              />
              <MenuItem
                primaryText="Logout"
                onClick={this.logout.bind(this)} />
            </IconMenu>
          </ToolbarGroup>
        </Toolbar>
      </div>
    )
  }
}

LoggedInToolbar.contextTypes = {
  router: PropTypes.object.isRequired,
}

LoggedInToolbar.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

export default LoggedInToolbar
