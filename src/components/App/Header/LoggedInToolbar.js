import React from 'react'
import PropTypes from 'prop-types'

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import Hamburger from 'material-ui/svg-icons/navigation/menu';
import DropDownMenu from 'material-ui/DropDownMenu';
import { Route, Router, Link, pathname, hashHistory } from 'react-router'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import mui, { Drawer, MenuItem, Styles, RaisedButton, FlatButton, Avatar } from 'material-ui';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import Comment from 'material-ui/svg-icons/communication/comment';
import GroupAdd from 'material-ui/svg-icons/social/group-add';

import apolloConfig from '../../../../apolloConfig';
import AuthService from 'utils/AuthService'
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import MainToolbar from '../../Home/Header/MainToolbar'

import './styles.css'

class LoggedInToolbar extends React.Component {
  constructor(props) {
    super(props);
    console.log('LoggedInToolbar props', props)
    this.state = {
      value: 3,
      open: false,
      /*profile: props.auth.getProfile(),*/
    };
    this.auth = new AuthService(apolloConfig.auth0ClientId, apolloConfig.auth0Domain);
  }

  handleChange (event, index, value){
    this.setState({value})
  };

  handleToggle() {
    this.setState({open: !this.state.open});
    console.log("open")
   }

  handleClose() {
    this.setState({open: false})
  }

  handleTouchTap(){
    this.context.router.push('/')
  }

  logout(){
    console.log('did the logout')
    this.auth.logout()
    this.context.router.push('/');
  }
  goToWorkouts(){
    hashHistory.push('/app')
  }
  render() {
    //console.log('LoggedInToolbar this', this)
    const { profile } = this.props
    return (
      <div>
       <Toolbar>
        <ToolbarGroup>
          <FontIcon className="muidocs-icon-custom-sort" />
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
            onClick={()=>this.context.router.push('/')}
            primaryText="Home" />
          <MenuItem
            onTouchTap={this.handleClose.bind(this)}
            onClick={()=>this.context.router.push('/app')}
            primaryText="Tribes" />
          <MenuItem
            onTouchTap={this.handleClose.bind(this)}
            primaryText="API">
            <Link to="https://us-west-2.api.scaphold.io/graphql/newGiveFitAlias" target="_blank"/>
          </MenuItem>
          <MenuItem
            onTouchTap={this.handleClose.bind(this)}
            onClick={()=>this.context.router.push('/about-us')}
            primaryText="About Us" />
          <MenuItem
            onTouchTap={this.handleClose.bind(this)}
            primaryText="Add a Group"
            leftIcon={<GroupAdd />} />
          </IconMenu>
          <ToolbarTitle className='title' text='givefit'
            onClick={()=>this.context.router.push('/')}
          />
        </ToolbarGroup>
        <ToolbarGroup >
          <FlatButton className='onlyLargeScreens' label="Tribes" onClick={()=>this.context.router.push('/app')}/>
          <FlatButton className='onlyLargeScreens' containerElement={<Link to="https://us-west-2.api.scaphold.io/graphql/newGiveFitAlias" target="_blank"/>} label="API"/>
          <FlatButton className='onlyLargeScreens' label="About Us" />
          <FontIcon className='onlyLargeScreens' className="muidocs-icon-custom-sort" />
          {
            this.props.profile ?
            <Avatar
              className='avatar'
              src={profile.picture}
              onClick={()=>this.context.router.push('/profile')}
            /> : null
          }
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
              onClick={()=>this.context.router.push('/profile')}
              />
            <MenuItem
              primaryText="Logout"
              onClick={this.logout.bind(this)} />
          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
      </div>
    );
  }
}

LoggedInToolbar.contextTypes = {
  router: PropTypes.object.isRequired
}

LoggedInToolbar.propTypes = {
  location: PropTypes.object
}

export default LoggedInToolbar
