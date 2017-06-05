import React from 'react'
import PropTypes from 'prop-types'

import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more'
import Hamburger from 'material-ui/svg-icons/navigation/menu'
import { Link, hashHistory } from 'react-router'
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar'
import { MenuItem, RaisedButton, FlatButton, Avatar } from 'material-ui'

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
              onTouchTap={this.handleClose.bind(this)}
              onClick={() => { window.location = 'https://givefit.net/about-us' }}
              primaryText='About Us'
            />
            <MenuItem
              primaryText="Profile"
              onTouchTap={this.handleClose.bind(this)}
              onClick={() => this.context.router.push('/profile')}
            />
            {process.env.__NODE_ENV__ === 'development' &&
              <MenuItem
                onTouchTap={this.handleClose.bind(this)}
                primaryText='API'
              >
                <Link to='https://us-west-2.api.scaphold.io/graphql/newGiveFitAlias' target='_blank' />
              </MenuItem>
            }
            <MenuItem
              onTouchTap={this.handleClose.bind(this)}
              onClick={() => this.logout()}
              primaryText='Logout'
            />
          </IconMenu>
        </ToolbarGroup>
        <ToolbarGroup className='onlyLargeScreens'>
          {process.env.__NODE_ENV__ === 'development' &&
            <FlatButton
              className='onlyLargeScreens'
              containerElement={<Link to='https://us-west-2.api.scaphold.io/graphql/newGiveFitAlias' target='_blank' />}
              label='API'
            />
          }
          <FlatButton label='About Us' onClick={() => { window.location = 'https://givefit.net/about-us' }} />
          <FlatButton label='Data' onClick={() => this.context.router.push('/data')} />
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
