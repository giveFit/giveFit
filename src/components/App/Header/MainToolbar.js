import React, { PropTypes as T, Component } from 'react'
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import Hamburger from 'material-ui/svg-icons/navigation/menu';
import DropDownMenu from 'material-ui/DropDownMenu';
import { Route, Router, Link, pathname } from 'react-router'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import mui, { Drawer, MenuItem, Styles, RaisedButton, FlatButton, Avatar } from 'material-ui';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import Comment from 'material-ui/svg-icons/communication/comment';
import GroupAdd from 'material-ui/svg-icons/social/group-add';
import styles from './styles.module.css';

const inlineStyles = {
  title: {
    cursor: 'pointer',
  },
  avatar: {
    margin: '10px 10px 10px 10px',  
    cursor: 'pointer'
  }
};

class MainToolbar extends Component {

  constructor(props) {
    console.log('toolbar constructor', props)
    super(props);
    this.state = {
      value: 3,
      open: false,
      /*profile: props.auth.getProfile(),*/
    };
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
    this.props.auth.route.auth.logout()
    this.context.router.push('/app');
  }

  render() {
    console.log('profile', profile)
    console.log('props', this.props)
    const { profile } = this.props
    console.log('toolbar this.props',this.props)
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
            onClick={()=>this.context.router.push('/home-logged-in')}
            primaryText="Home" />
          <MenuItem 
            onTouchTap={this.handleClose.bind(this)}
            onClick={()=>this.context.router.push('/app-logged-in')}
            primaryText="Workout Locations" />
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
            onClick={this.props.auth.route.auth.login.bind(this)}
            primaryText="Add a Group"
            leftIcon={<GroupAdd />} />
          </IconMenu>
          <ToolbarTitle style={inlineStyles.title} text="givefit" 
            onClick={()=>this.context.router.push('/home-logged-in')}
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <FlatButton label="Workout Groups" onClick={()=>this.context.router.push('/app-logged-in')}/>
          <FlatButton label="Blog" />
          <FlatButton label="About Us" />
          <FontIcon className="muidocs-icon-custom-sort" />
          <ToolbarSeparator />
          <Avatar 
            style={inlineStyles.avatar} 
            src={profile.picture}
            onClick={()=>this.context.router.push('/profile')} 
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

  MainToolbar.contextTypes = {
      router : T.object.isRequired
    }

    MainToolbar.propTypes = {
      location: T.object,
    };

export default MainToolbar