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

const inlineStyles = {
  title: {
    cursor: 'pointer',
  },
  avatar: {
    margin: '10px 10px 10px 10px',  }
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
    this.props.auth.logout()
    this.context.router.push('/app');
  }

  render() {
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
            onClick={this.props.auth.route.auth.login.bind(this)}
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
          <RaisedButton label="Login" primary={true} onClick={this.props.auth.route.auth.login.bind(this)}/>
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