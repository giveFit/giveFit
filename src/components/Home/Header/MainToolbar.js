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


const styles = {
  title: {
    cursor: 'pointer',
  },
};

class MainToolbar extends Component {

  constructor(props) {
    console.log('toolbar constructor', props)
    super(props);
    this.state = {
      value: 3,
      open: false,
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

  render() {
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
            <Link to='/about-us'>About Us</Link>
          </MenuItem>
          <MenuItem onTouchTap={this.handleClose.bind(this)}>
            <RaisedButton onClick={this.props.auth.route.auth.login.bind(this)}>Login</RaisedButton>
          </MenuItem>

          </IconMenu>
          <ToolbarTitle style={styles.title} text="givefit" 
            onClick={this.handleTouchTap.bind(this)}
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <FlatButton label="Workouts" onClick={()=>this.context.router.push('/app')}/>
          <FlatButton label="Blog" />
          <FlatButton label="About Us" />
          <FontIcon className="muidocs-icon-custom-sort" />
          <ToolbarSeparator />
          <RaisedButton label="Login" primary={true} onClick={this.props.auth.route.auth.login.bind(this)}/>
          <IconMenu
            iconButtonElement={
              <IconButton touch={true}>
                <NavigationExpandMoreIcon />
              </IconButton>
            }
          >
            <MenuItem primaryText="Download" />
            <MenuItem primaryText="More Info" />
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