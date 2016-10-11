import React, { PropTypes, Component } from 'react'
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
  componentWillMount() {
        // const script = document.createElement("script");
        // script.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing&key=AIzaSyBHKy1LTcqyrPI6duYgTmLT8vlpE9dAJRo";
        // document.body.appendChild(script);
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
                {this.props.children}
                </div>
            );
        }
    }

    MainToolbar.contextTypes = {
      router : PropTypes.object.isRequired
    }

export default MainToolbar;
