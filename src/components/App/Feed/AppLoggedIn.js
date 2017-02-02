import React, { Component, PropTypes as T } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import GridComponentWithData from './GridComponent';
import LoggedInToolbar from '../Header/LoggedInToolbar'
import apolloConfig from '../../../../apolloConfig';
//local utils
import AuthService from 'utils/AuthService'
import MainToolbar from '../../Home/Header/MainToolbar'


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
  	}
	render() {
		console.log('AppLoggedIn this', this)
		return (
			<div> 
				<div>
					<GridComponentWithData 					
						workoutGroups={(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ? this.props.data.viewer.allWorkoutGroups.edges : []}
						//workouts={(!this.props.data.loading && this.props.data.viewer.allWorkouts.edges) ? this.props.data.viewer.allWorkouts.edges : []}
						markers={(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ?  this.props.data.viewer.allWorkoutGroups.edges.map((i,index)=>({
							//title : i.node.title,
							position : {
								lat : parseFloat(i.node.lat),
								lng : parseFloat(i.node.lng)
							}
						})) : []}
						onPlaceSelect={(place)=>{
						this.props.data.refetch({
							latLng : place.address
						});
							return null;
						}}

					/>
				</div>
			
		</div>
		)
	};
}


const AppLoggedInWithData =  compose(
  graphql(GET_THROUGH_VIEWER, {
    options: (props) => ({  
      variables: { first : FIRST } 
    }),
  }),
)(AppLoggedIn);

export default AppLoggedInWithData;
