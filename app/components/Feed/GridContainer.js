import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import GridComponent from './GridComponent';

class GridContainer extends React.Component {

	render() {
		console.log("props")
		console.log(this.props)
		console.log("error")
		console.log(this.props.data.error)
		console.log("error")
		console.log(this.props.data.workouts)

		return this.props.data.loading === true
		? <p> Loading </p>
		:	<div>
				<GridComponent 
					workouts={this.props.data.workouts} 
					/>
			</div>

	}
};

const LAT_LNG = "39.292013,-76.653072";
const GET_WORKOUTS = gql`
  query getWorkouts($latLng: String!){
     workouts(latLng: $latLng){title, date, time, location, author, contentSnippet, tags, day, image, avatar, id }
  }
`;

const GridContainerWithData = graphql(GET_WORKOUTS, {
	options(props) {
		return { 
		variables: { 
			latLng : LAT_LNG
		}
	};
}})(GridContainer);

export default GridContainerWithData;