import React, { Component, PropTypes as T } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import GridComponent from './GridComponent';
import MainToolbar from '../Header/MainToolbar'

//local utils
import AuthService from 'utils/AuthService';
import searchNearby from 'utils/googleApiHelpers';
import apolloConfig from '../../../../apolloConfig';

class GridContainer extends React.Component {
	constructor(props, context) {
		console.log('GridContainer constructor', props)
	    super(props, context)
	    this.state = {
	      profile: null,
	      token: null,
	    };
	    this.auth = new AuthService(apolloConfig.auth0ClientId, apolloConfig.auth0Domain);
      this.onAuthenticated = this.onAuthenticated.bind(this);  
    	this.auth.on('authenticated', this.onAuthenticated);
    	this.auth.on('error', console.log);
  	}

  	onAuthenticated(auth0Profile, tokenPayload) {
    console.log('GridContainer did the auth//props', this.props)
    console.log("auth0Profile", auth0Profile)
    const identity = auth0Profile.identities[0];
    const that = this;
    //debugger;
    this.props.loginUser({
      identity: identity,
      access_token: tokenPayload.accessToken,
    }).then(res => {
    	console.log('are we getting a res from the gridcontainer', res)
      const scapholdUserId = res.data.loginUserWithAuth0Lock.user.id;
      const profilePicture = auth0Profile.picture;
      const nickname = auth0Profile.nickname;
      return that.props.updateUser({
        id: scapholdUserId,
        picture: profilePicture,
        nickname: nickname
      });
      // Cause a UI update :)
      this.setState({});
    }).catch(err => {
      console.log(`Error updating user: ${err.message}`);
    });
  }

  	onReady(mapProps, map) {
  		const {google} = this.props;
  		const opts = {
  			location: map.center,
  			radius: '500',
  			types: ['cafe']
  		}
		searchNearby(google, map, opts)
			.then((results, pagination) => {
				//We got some results and a pag. object
			}).catch((status, result) =>{
				//There was an error
			})
  	}
	render() {
		console.log("props for the gridcontainer", this.props)
		return (

			<div>
				<MainToolbar auth={this.props}/>
				<GridComponent onPlaceSelect={(place)=>{
					console.log("place---");
					console.log(place);
					console.log(this.props);
					this.props.data.refetch({
						latLng : place.address
					});
					return null;
				}}
				workouts={(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ? this.props.data.viewer.allWorkoutGroups.edges : []}
				markers={(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ?  this.props.data.viewer.allWorkoutGroups.edges.map((i,index)=>({
					title : i.node.title,
					position : {
						lat : parseFloat(i.node.lat),
						lng : parseFloat(i.node.lng)
					}
				})) : []} />
		</div>
		)
	};
}

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
const FIRST = 6;

const LOGIN_USER_WITH_AUTH0_LOCK = gql `
  mutation loginUserWithAuth0Lock($data: LoginUserWithAuth0LockInput!) {
    loginUserWithAuth0Lock(input: $data) {
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

const GridContainerWithData =  compose(
  graphql(GET_THROUGH_VIEWER, {
    options: (props) => ({  
      variables: { first : FIRST } 
    }),
  }),
  graphql(LOGGED_IN_USER, {
    props: ({ data }) =>  ({
      loggedInUser: data.viewer ? data.viewer.user : null
    })
  }),
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
)(GridContainer);

export default GridContainerWithData;
