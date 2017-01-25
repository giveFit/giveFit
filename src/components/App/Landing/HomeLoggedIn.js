import React, { PropTypes as T } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText, GridList} from 'material-ui/Card';
import HomeFeed from './SubComponents/HomeFeed';
import LoggedInToolbar from '../Header/LoggedInToolbar'
import MainToolbar from '../../Home/Header/MainToolbar'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import AuthService from 'utils/AuthService';
import TextField from 'material-ui/TextField';
import styles from './styles.module.css';
import RaisedButton from 'material-ui/RaisedButton';
import {orange500, blue500, indigo500} from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import apolloConfig from '../../../../apolloConfig';

const inlineStyles = {
  textFieldStyle: {
    color: indigo500,
  }
}

export class HomeLoggedIn extends React.Component {
  constructor(props, context) {
    console.log('HomeLoggedIn props', props)
    super(props, context)
    this.state = {
      profile: null,
      token: null,
      userId: null,
      //hintText: "Enter a location"
    };
    this.onAuthenticated = this.onAuthenticated.bind(this);
    this.auth = new AuthService(apolloConfig.auth0ClientId, apolloConfig.auth0Domain);
    this.auth.on('authenticated', this.onAuthenticated);
    this.auth.on('error', console.log);
  }
  /*componentDidMount(){
    console.log('componentDidMount');
    localStorage.setItem('userId', JSON.stringify(this.state.userId))
  }*/
  handleSubmit(){
    /*I want users to be able to press the button without
    entering anything, but still have the value declaration
    below for when i do a location query*/
    /*const {value} = this.refs.textbox.input;*/
    this.context.router.push('/app-logged-in');
  }
  //different config
  onAuthenticated(auth0Profile, tokenPayload) {
    console.log('onAuthenticated props', this.props)
    console.log("auth0Profile", auth0Profile)
    console.log("tokenPayload", tokenPayload)
    const identity = auth0Profile.identities[0];
    const that = this;
    //debugger;
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
      //this.setState({userId: scapholdUserId});
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
  //Need Google maps API here
  handleAutoComplete(){
    /*this.setState({
      hintText = null;
    })*/
    new google.maps.places.Autocomplete(
    (document.getElementById('autocomplete')), {
        types: ['geocode']
    });
  }
  render(){
    console.log('HomeLoggedIn this', this)
    const profile = this.auth.getProfile();
    console.log('HomeLoggedIn profile', profile)
    const workouts=(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ? this.props.data.viewer.allWorkoutGroups.edges : [];
    console.log('profile', profile);
    const listView = workouts.length ? <div className={styles.workouts}>
    {workouts.map((item, index) => (
         <div key={index} className={styles.workout}> {!item ||
          (<HomeFeed
            data={item.node}
         />)} </div>
    ))}
    </div> : <CircularProgress size={80} />
    return (
      <div className={styles.root}>
      { !this.auth.loggedIn() ? 
          <MainToolbar
            auth={this.props}
          /> : 
          <LoggedInToolbar 
            auth={this.props}
            profile={profile}
            userId={this.state.userId}
          /> 
      }
      <div className={styles.banner}>
      <div className={styles.bannerInner}>
        <h1 className={styles.heading}>Find Your Fitness Tribe</h1>
        <h3 className={styles.subHeading}>Starting in Baltimore</h3>
        <Card className={styles.bannerCard}>
          <CardText>
            <TextField
             ref="textbox"
             id="autocomplete"
             hintText="Enter a location"
             multiLine={true}
             onTouchTap={this.handleAutoComplete.bind(this)}
             textareaStyle={inlineStyles.textFieldStyle}
             onKeyDown={(e)=>{
               if(e.which===13){
                 this.handleSubmit();
               }
             }}
           />
           <RaisedButton label="Find Groups" secondary={true} className={styles.submitButton} onTouchTap={()=>this.handleSubmit()} />
           <br />
        </CardText>
        </Card>
        </div>
      </div>
      <h2 className={styles.featuredWorkouts}>
           Check out this week's highlighted workout groups. 
           Search above for more awesome group workouts in your area.
      </h2>
           {listView}
        </div>
    )
  }
}

HomeLoggedIn.contextTypes = {
  router: T.object
};


//Get some WorkoutGroups
const GET_THROUGH_VIEWER = gql`
	query GetThroughViewer($first: Int) {
  	viewer {
	  	allWorkoutGroups(first: $first) {
	  		edges {
	  			node {
				  id
				  image
				  title
				  lat
				  lng
				  avatar
				  contentSnippet
	  			}
	  		}
	  	}
	}
}
`;

//How many WorkoutGroups to return
const FIRST = 8;

const LOGIN_USER_WITH_AUTH0_LOCK = gql `
  mutation Login($credential: LoginUserWithAuth0LockInput!) {
  loginUserWithAuth0Lock(input: $credential) {
    user {
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

const LOGGED_IN_USER = gql`
  query LoggedInUser {
    viewer {
      user {
        id
        username
        nickname
      }
    }
  }
`;

const HomeLoggedInWithData =  compose(
  graphql(GET_THROUGH_VIEWER, {
    options: (props) => ({  
      variables: { first : FIRST } 
    }),
  }),
  /*graphql(LOGGED_IN_USER, {
    props: ({ data }) =>  ({
      loggedInUser: data.viewer ? data.viewer.user : null
    })
  }),*/
  graphql(LOGIN_USER_WITH_AUTH0_LOCK, {
    props: ({ mutate }) => ({
      loginUser: (credential) => mutate({ variables: { credential: credential } })
    })
  }),
  graphql(UPDATE_USER_QUERY, {
    props: ({ mutate }) => ({
      updateUser: (user) => mutate({ variables: { user: user }}),
    })
  })
)(HomeLoggedIn);

export default HomeLoggedInWithData;
