import React, { PropTypes as T, Component } from 'react'
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
import styles from './styles.module.css';
import apolloConfig from '../../../../apolloConfig';
import AuthService from 'utils/AuthService'
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import MainToolbar from '../../Home/Header/MainToolbar'

/*const LOGGED_IN_USER = gql`
  query LoggedInUser {
    viewer {
      user {
        id
        username
        nickname
      }
    }
  }
`;*/


const LOGIN_USER_WITH_AUTH0_LOCK = gql `
  mutation loginUserWithAuth0Lock($credential: LoginUserWithAuth0LockInput!) {
    loginUserWithAuth0Lock(input: $credential) {
    user{
      id
      username
    }
    }
  }
`
const UPDATE_USER_QUERY = gql`
mutation UpdateUser($user: UpdateUserInput!) {
  updateUser(input: $user) {
    changedUser {
      id
      username
      picture
    }
  }
}
`;

const inlineStyles = {
  title: {
    cursor: 'pointer',
  },
  avatar: {
    margin: '10px 10px 10px 10px',  
    cursor: 'pointer'
  }
};

class LoggedInToolbar extends Component {
  constructor(props) {
    super(props);
    console.log('LoggedInToolbar props', props)
    this.state = {
      value: 3,
      open: false,
      profile: null,
      /*profile: props.auth.getProfile(),*/
    };
    this.auth = new AuthService(apolloConfig.auth0ClientId, apolloConfig.auth0Domain);
    this.startLogin = this.startLogin.bind(this);
    this.onAuthenticated = this.onAuthenticated.bind(this);  
    this.auth.on('authenticated', this.onAuthenticated);
    this.onLoggedOut = this.onLoggedOut.bind(this);
    this.auth.on('loggedOut', this.onLoggedOut);
    this.auth.on('error', console.log);
  }
  startLogin() {
    this.auth.login();
  }
  onLoggedOut(){
    this.setState({profile: null})
  }
  onAuthenticated(auth0Profile, tokenPayload) {
      console.log('onAuthenticated props', this.props)
      console.log("auth0Profile", auth0Profile)
      console.log("tokenPayload", tokenPayload)
      const identity = auth0Profile.identities[0];
      //updateUser/loginUser expects userId, not user_id
      identity.userId = identity.user_id;
      delete identity.user_id;
      console.log('LoggedInToolbar identity', identity)
      const that = this;
      //debugger;
      this.setState({profile: auth0Profile});
      this.props.loginUser({
        identity: identity,
        access_token: tokenPayload.accessToken,
      }).then(res => {
        console.log('authentication response', res)
        const scapholdUserId = res.data.loginUserWithAuth0Lock.user.id;
        const profilePicture = auth0Profile.picture;
        const nickname = auth0Profile.nickname;
        // Cause a UI update :)
        console.log('scapholdUserId', scapholdUserId)
        localStorage.setItem('scapholdUserId', JSON.stringify(scapholdUserId))

        return that.props.updateUser({
          id: scapholdUserId,
          picture: profilePicture,
          nickname: nickname
        });

      }).catch(err => {
        console.log(`Error updating user: ${err.message}`);
      });
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
  
  /*handleTouchTap(){
    this.context.router.push('/')
  }*/

  logout(){
    console.log('did the logout')
    this.auth.logout()
    //this.context.router.push('/');
  }
  goToWorkouts(){
    hashHistory.push('/app-logged-in')
  }
  /*componentDidMount(){
    var profile = this.auth.getProfile();
  }*/
  render() {
    console.log('LoggedInToolbar this', this)
    console.log('LoggedInToolbar profile', this.state.profile)
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
            primaryText="Add a Group"
            leftIcon={<GroupAdd />} />
          </IconMenu>
          <ToolbarTitle style={inlineStyles.title} text="givefit" 
            onClick={()=>this.context.router.push('/')}
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <FlatButton label="Workout Groups" onClick={()=>this.context.router.push('/app')}/>
          <FlatButton label="Blog" />
          <FlatButton label="About Us" />
          <FontIcon className="muidocs-icon-custom-sort" />
          <ToolbarSeparator />
          {
          this.state.profile ? 
          <div>
              <Avatar 
                style={inlineStyles.avatar} 
                src={this.state.profile.picture}
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
            </div> : <RaisedButton label="Login" primary={true} onClick={this.startLogin}/>
          }
        </ToolbarGroup>
      </Toolbar>
      </div>
    );
  }
}

  LoggedInToolbar.contextTypes = {
      router : T.object.isRequired
    }

    LoggedInToolbar.propTypes = {
      location: T.object,
    };

const LoggedInToolbarWithData =  compose(
    graphql(LOGIN_USER_WITH_AUTH0_LOCK, {
      props: ({ mutate }) => ({
        loginUser: (credential) => mutate({ variables: { credential: credential } })
      })
    }),
    /*graphql(LOGGED_IN_USER, {
      props: ({ data }) =>  ({
        loggedInUser: data.viewer ? data.viewer.user : null
      })
    }),*/
    graphql(UPDATE_USER_QUERY, {
        props: ({ mutate }) => ({
          updateUser: (user) => mutate({ variables: { user: user }}),
        })
    })
)(LoggedInToolbar);

export default LoggedInToolbarWithData;