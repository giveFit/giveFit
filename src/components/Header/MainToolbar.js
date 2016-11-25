import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router';
import { Route, Router } from 'react-router'

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import mui, { Drawer, AppBar, MenuItem, Styles } from 'material-ui';

import Login from '../Login/Login';

class MainToolbar extends Component  {
  constructor(props){
    super(props);
    this.state = {open:false};
  }
  //open the side bar
  handleToggle() {
    this.setState({open: !this.state.open});
    console.log("open")
   }

   handleClose() {
    this.setState({open: false})
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
            onRequestChange={(open) => this.setState({open})}
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
              <Link to='/map'>Map</Link>
            </MenuItem>
            <MenuItem onTouchTap={this.handleClose.bind(this)}>Login</MenuItem>
          </Drawer>

          <AppBar title={"GiveFit"}
          onTitleTouchTap={()=>this.context.router.push('/')}
          onLeftIconButtonTouchTap={this.handleToggle.bind(this)} />
          {children}
          </div>
      );
        }
    }

    MainToolbar.contextTypes = {
      router : PropTypes.object.isRequired
    }

export default MainToolbar;
