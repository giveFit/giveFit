import React from 'react'
import PropTypes from 'prop-types'

import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import Hamburger from 'material-ui/svg-icons/navigation/menu'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import { MenuItem, RaisedButton, FlatButton } from 'material-ui'
import PersonAdd from 'material-ui/svg-icons/social/person-add'

import apolloConfig from '../../../apolloConfig'
import AuthService from 'utils/AuthService'

import { Link } from 'react-router'

import './MainToolbar.css'

class MainToolbar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: 3,
      open: false,
    }
    this.startLogin = this.startLogin.bind(this)
    this.auth = new AuthService(apolloConfig.auth0ClientId, apolloConfig.auth0Domain)
  }

  startLogin () {
    this.auth.login()
  }

  handleToggle () {
    this.setState({ open: !this.state.open })
  }

  handleClose () {
    this.setState({ open: false })
  }

  render () {
    return (
      <div>
        <Toolbar>
          <ToolbarGroup>
            <FontIcon className='muidocs-icon-custom-sort' />
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
                onClick={() => this.context.router.push('/')}
                primaryText='Home' />
              <MenuItem
                onTouchTap={this.handleClose.bind(this)}
                onClick={() => this.context.router.push('/explore')}
                primaryText='Groups' />
              <MenuItem
                onTouchTap={this.handleClose.bind(this)}
                primaryText='API' >
                <Link to='https://us-west-2.api.scaphold.io/graphql/newGiveFitAlias' target='_blank' />
              </MenuItem>
              <MenuItem
                onTouchTap={this.handleClose.bind(this)}
                onClick={() => this.context.router.push('/about-us')}
                primaryText='About Us' />
              <MenuItem
                onTouchTap={this.handleClose.bind(this)}
                onClick={this.startLogin}
                primaryText='Log in'
                leftIcon={<PersonAdd />} />
            </IconMenu>
            <ToolbarTitle
              className='title'
              text='givefit'
              onClick={() => this.context.router.push('/')}
            />
          </ToolbarGroup>
          <ToolbarGroup className='onlyLargeScreens'>
            <FlatButton label='Groups' onClick={() => this.context.router.push('/explore')} />
            <FlatButton className='onlyLargeScreens' containerElement={<Link to='https://us-west-2.api.scaphold.io/graphql/newGiveFitAlias' target='_blank' />} label='API' />
            <FlatButton label='About Us' onClick={() => this.context.router.push('/about-us')} />
            <FontIcon className='muidocs-icon-custom-sort' />
            <ToolbarSeparator />
            <RaisedButton
              label='Login'
              primary={true}
              onClick={this.startLogin}
            />
          </ToolbarGroup>
        </Toolbar>
      </div>
    )
  }
}

MainToolbar.contextTypes = {
  router: PropTypes.object.isRequired,
}

export default MainToolbar
