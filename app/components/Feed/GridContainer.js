import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import GridComponent from './GridComponent';

class GridContainer extends React.Component {

	render() {
		console.log("props", this.props)
		console.log("error", this.props.data.error)
		let loading = this.props.data.loading
		console.log("loading?", loading)
		if (loading == false){
			console.log("not loading any more", this.props.data.viewer.allWorkoutGroups.edges)
		}
		/*this.props.data.loading ? console.log("still loading", this.props.data) : 
		console.log("workouts",this.props.data.viewer.allWorkoutGroups)
		*/

		return (
			<div>
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
				markers={(!this.props.data.loading && this.props.data.viewer.allWorkoutGroups.edges) ?  this.props.data.viewer.allWorkoutGroups.edges.map(i=>({
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

const GridContainerWithData = graphql(GET_THROUGH_VIEWER, {
	options(props) {
		return {
		variables: {
			first : FIRST
		}
	};
}})(GridContainer);


export default GridContainerWithData;
