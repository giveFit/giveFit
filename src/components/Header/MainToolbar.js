import React, { PropTypes as T, Component } from 'react'
import { Link } from 'react-router';
import { Route, Router } from 'react-router'

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import mui, { Toolbar, Drawer, AppBar, MenuItem, Styles, RaisedButton, FlatButton, Avatar } from 'material-ui';

//local utils
import AuthService from 'utils/AuthService'

//inline styles
const styles = {
  title: {
    cursor: 'pointer',
  },
};

class MainToolbar extends Component  {
  constructor(props, context){
    super(props, context);
    this.state = {
      open: false,
      profile: [],
    };
  }
  //open the side bar
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
  render() {
  let children = null;
  if (this.props.children) {
    children = React.cloneElement(this.props.children, {
      auth: this.props.route.auth //sends auth instance to children
    })
    console.log("children :)", children)
  }
    return (
      <div>
      <Drawer
        docked={false}
        open={this.state.open}
        //onRequestChange={(open) => this.setState({open})}
      >
        <MenuItem onTouchTap={this.handleClose.bind(this)}>
        <Link to='/'>Home</Link>
        </MenuItem>
        <MenuItem onTouchTap={this.handleClose.bind(this)}>
          <Link to='/app'>Workout Groups</Link>
        </MenuItem>
        <MenuItem onTouchTap={this.handleClose.bind(this)}>
          <Link to='/blog'>Blog</Link>
        </MenuItem>

        <MenuItem onTouchTap={this.handleClose.bind(this)}>
          <RaisedButton onClick={children.props.auth.login.bind(this)}>Login</RaisedButton>
        </MenuItem>
      </Drawer>

      <AppBar title={<span style={styles.title}>givefit</span>}
      onTitleTouchTap={()=>this.handleTouchTap()}
      onLeftIconButtonTouchTap={this.handleToggle.bind(this)} 
      iconElementRight={
        <Avatar src={this.state.profile.picture_large}/>}
      />
      {children}
      </div>
    );
  }
}

    MainToolbar.contextTypes = {
      router : T.object.isRequired
    }

    MainToolbar.propTypes = {
      location: T.object,
      auth: T.instanceOf(AuthService)
    };

export default MainToolbar;
