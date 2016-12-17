import React, { Component, PropTypes as T } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import GridComponent from './GridComponent';
import MainToolbar from '../Header/MainToolbar'

//local utils
import AuthService from 'utils/AuthService';
import searchNearby from 'utils/googleApiHelpers';


class GridContainer extends React.Component {
	constructor(props, context) {
		console.log('GridContainer constructor', props)
	    super(props, context)
	    this.state = {
	      profile: props.route.auth.getProfile(),
	      token: props.route.auth.getToken(),
	    };

	    props.route.auth.on('profile_updated', (newProfile) => {
	      console.log('newProfile', newProfile)
	      var access_token = this.state.token;
	      var identity = newProfile.identities[0];
	      console.log("token", access_token)
	      console.log("identity", identity)
	      this.props.register({
	        identity, access_token
	      }).then(({ data }) => {
	        console.log('got data', data);
	      }).catch((error) => {
	        console.log('there was an error sending the query', error);
	      });
	      console.log('what do we have', newProfile)
	      this.setState({
	        profile: newProfile,
	      })
	    })
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
		console.log("gridcontainer props", this.props)
		console.log("error", this.props.data.error)
		let loading = this.props.data.loading
		console.log("loading?", loading)
		if (loading == false){
			console.log("not loading any more", this.props.data.viewer.allWorkoutGroups.edges)
		}
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

/*const GridContainerWithData = graphql(GET_THROUGH_VIEWER, {
	options: (props) => ({	
		variables: {
			first : FIRST
		}
	}),
})(GridContainer);*/
GridContainer.propTypes = {
  auth: T.instanceOf(AuthService),
  register: T.func.isRequired
};

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
const GridContainerWithData =  graphql(GET_THROUGH_VIEWER, {
	options: (props) => ({	
		variables: {
			first : FIRST
		}
	}),
})(
  graphql(LOGIN_USER_WITH_AUTH0_LOCK, {
  props: ({ mutate }) => ({
    register: (data) => mutate({
      variables: {
        data
      }
    }),
  }),
})(GridContainer));

export default GridContainerWithData;
