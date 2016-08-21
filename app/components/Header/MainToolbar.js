import React, { Component } from 'react'
import { Link } from 'react-router';
import { Route, Router } from 'react-router'

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import mui, { Drawer, AppBar, MenuItem, Styles } from 'material-ui';
//import MyRawTheme from '../../../static/material_ui_raw_theme_file';

export default class MainToolbar extends Component  {
  constructor(props){
    super(props);
    this.state = {open:false};
  }

  handleToggle() {
    this.setState({open: !this.state.open});
    console.log("open")
   }

   handleClose() {
    this.setState({open: false})
   }
        render() {
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
                  <MenuItem onTouchTap={this.handleClose.bind(this)}>Login</MenuItem>
                  <MenuItem onTouchTap={this.handleClose.bind(this)}>Blog</MenuItem>
                </Drawer>

                <AppBar title={<Link to='/'>givefit</Link>}
                onLeftIconButtonTouchTap={this.handleToggle.bind(this)} />
                {this.props.children}
                </div>
            );
        }
    }

export default MainToolbar;
