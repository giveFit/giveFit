import React, { Component, PropTypes as T } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import GridComponentWithData from './GridComponent';
import LoggedInToolbar from '../Header/LoggedInToolbar'
import apolloConfig from '../../../../apolloConfig';
//local utils
import AuthService from 'utils/AuthService'
import MainToolbar from '../../Home/Header/MainToolbar'

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

class AppLoggedIn extends Component {
	constructor(props, context) {
		console.log('AppLoggedIn props', props)
	    super(props, context)
	    this.state = {
	      profile: null,
	      token: null,
	      user: null,
	      loggedInToolbar: false,
	    };
	    this.auth = new AuthService(apolloConfig.auth0ClientId, apolloConfig.auth0Domain);
  	}
	render() {
		//Grab profile from localStorage via auth service
		const profile = this.auth.getProfile();
		return (
			<div> 
				<div>
					<GridComponentWithData onPlaceSelect={(place)=>{
						this.props.data.refetch({
							latLng : place.address
						});
						return null;
					}}
					profile={profile}
					workouts={(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ? this.props.data.viewer.allWorkoutGroups.edges : []}
					markers={(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ?  this.props.data.viewer.allWorkoutGroups.edges.map((i,index)=>({
						//title : i.node.title,
						position : {
							lat : parseFloat(i.node.lat),
							lng : parseFloat(i.node.lng)
						}
					})) : []} />
				</div>
			
		</div>
		)
	};
}
AppLoggedIn.propTypes = {
  auth: T.instanceOf(AuthService),
  loginUser: T.func.isRequired
};


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
	graphql(UPDATE_USER_QUERY, {
	    props: ({ mutate }) => ({
	      updateUser: (user) => mutate({ variables: { user: user }}),
	    })
	})
)(AppLoggedIn);

export default AppLoggedInWithData;