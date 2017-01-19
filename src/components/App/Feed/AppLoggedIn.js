import React, { Component, PropTypes as T } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import GridComponent from './GridComponent';
import MainToolbar from '../Header/MainToolbar'

//local utils
import AuthService from 'utils/AuthService'

class AppLoggedIn extends Component {
	constructor(props, context) {
		console.log('GridContainer constructor', props)
	    super(props, context)
	    this.state = {
	      profile: props.route.auth.getProfile(),
	      token: props.route.auth.getToken(),
	      user: null
	    };

	    props.route.auth.on('authenticated', (auth0Profile, tokenPayload) => {
	      console.log('auth0Profile', auth0Profile)
	      console.log('tokenPayload', tokenPayload)
	      var access_token = this.state.token;
	      var identity = auth0Profile.identities[0];
	      const that = this;
	      this.props.loginUser({
	        identity: identity, 
	        access_token: tokenPayload.accessToken,
	      }).then(res => {
	      	console.log('res going to updateUser', res)
		      const scapholdUserId = res.data.loginUserWithAuth0Lock.user.id;
		      const profilePicture = auth0Profile.picture;
		      const nickname = auth0Profile.nickname;
		      // Cause a UI update :)
		      console.log('scapholdUserId', scapholdUserId)
		      this.setState({
		      	user: scapholdUserId
		      });
		      return that.props.updateUser({
		        id: scapholdUserId,
		        picture: profilePicture,
		        nickname: nickname
		      });
		      
		    }).catch((error) => {
	        console.log('there was an error sending the query', error);
	      });
	      console.log('what do we have', auth0Profile)
	      this.setState({
	        profile: auth0Profile,
	      })
	    })
  	}
	render() {
		console.log("gridcontainer props", this.props)
		console.log("error", this.props.data.error)
		let loading = this.props.data.loading
		console.log("loading?", loading)
		if (loading == false){
			console.log("not loading any more", this.props.data.viewer.allWorkoutGroups.edges)
		}
		console.log("this.state", this.state)
		return (
			<div>
				<MainToolbar 
					auth={this.props}
					profile={this.state.profile}
				/>
				<GridComponent onPlaceSelect={(place)=>{
					console.log("place---");
					console.log(place);
					console.log(this.props);
					this.props.data.refetch({
						latLng : place.address
					});
					return null;
				}}
				profile={this.state.profile}
				user={this.state.user}
				workouts={(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ? this.props.data.viewer.allWorkoutGroups.edges : []}
				markers={(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ?  this.props.data.viewer.allWorkoutGroups.edges.map((i,index)=>({
					//title : i.node.title,
					position : {
						lat : parseFloat(i.node.lat),
						lng : parseFloat(i.node.lng)
					}
				})) : []} />
		</div>
		)
	};
}
AppLoggedIn.propTypes = {
  auth: T.instanceOf(AuthService),
  loginUser: T.func.isRequired
};

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
  mutation loginUserWithAuth0Lock($credential: LoginUserWithAuth0LockInput!) {
    loginUserWithAuth0Lock(input: $credential) {
    user{
      id
      username
    }
    }
  }
`
const UpdateUserQuery = gql`
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

const AppLoggedInWithData =  compose(
	graphql(GET_THROUGH_VIEWER, {
		options: (props) => ({	
			variables: { first : FIRST } 
		}),
	}),
  	graphql(LOGIN_USER_WITH_AUTH0_LOCK, {
	  props: ({ mutate }) => ({
	    loginUser: (credential) => mutate({ variables: { credential: credential } })
	  	})
  	}),
  	graphql(LOGGED_IN_USER, {
	    props: ({ data }) =>  ({
	      loggedInUser: data.viewer ? data.viewer.user : null
	    })
  	}),
  graphql(UpdateUserQuery, {
    props: ({ mutate }) => ({
      updateUser: (user) => mutate({ variables: { user: user }}),
    })
  })
)(AppLoggedIn);

export default AppLoggedInWithData;
