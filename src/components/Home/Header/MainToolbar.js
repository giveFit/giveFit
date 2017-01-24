import React, { PropTypes as T, Component } from 'react'
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import Hamburger from 'material-ui/svg-icons/navigation/menu';
import DropDownMenu from 'material-ui/DropDownMenu';
import { Route, Router, Link } from 'react-router'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import mui, { Drawer, MenuItem, Styles, RaisedButton, FlatButton, Avatar } from 'material-ui';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import apolloConfig from '../../../../apolloConfig';
import AuthService from 'utils/AuthService';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import { hashHistory } from 'react-router';

const inlineStyles = {
  title: {
    cursor: 'pointer',
  },
  avatar: {
    margin: '10px 10px 10px 10px',  }
};

class MainToolbar extends Component {

  constructor(props) {
    console.log('MainToolbar props', props)
    super(props);
    this.state = {
      value: 3,
      open: false,
      /*profile: props.auth.getProfile(),*/
    };
    this.startLogin = this.startLogin.bind(this);
    this.auth = new AuthService(apolloConfig.auth0ClientId, apolloConfig.auth0Domain);
    
  }
  
  startLogin() {
    this.auth.login();
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
    this.auth.logout()
    this.context.router.push('/');
  }

  render() {
    const { profile } = this.props
    return (
      <div>
       <Toolbar>
        <ToolbarGroup>
          <FontIcon className="muidocs-icon-custom-sort" />
          <IconMenu
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
            primaryText="Workout Groups" />
          <MenuItem 
            onTouchTap={this.handleClose.bind(this)}
            onClick={()=>this.context.router.push('/blog')}
            primaryText="Blog" />
          <MenuItem 
            onTouchTap={this.handleClose.bind(this)}
            onClick={()=>this.context.router.push('/about-us')}
            primaryText="About Us" />
          <MenuItem 
            onTouchTap={this.handleClose.bind(this)}
            onClick={this.startLogin}
            primaryText="Log in"
            leftIcon={<PersonAdd />} />
          </IconMenu>
          <ToolbarTitle style={inlineStyles.title} text="givefit" 
            onClick={()=>this.context.router.push('/')}
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <FlatButton label="Workouts" onClick={()=>this.context.router.push('/app')}/>
          <FlatButton label="Blog" />
          <FlatButton label="About Us" />
          <FontIcon className="muidocs-icon-custom-sort" />
          <ToolbarSeparator />
          <RaisedButton label="Login" primary={true} onClick={this.startLogin}/>
        </ToolbarGroup>
      </Toolbar>
      </div>
    );
  }
}

  MainToolbar.contextTypes = {
      router : T.object.isRequired
    }

    MainToolbar.propTypes = {
      location: T.object,
    };

export default MainToolbar;