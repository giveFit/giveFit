import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import GridComponent from './GridComponent';

class GridContainer extends React.Component {

	render() {
		console.log("props", this.props)
		console.log("error", this.props.data.error)
		console.log("workouts",this.props.data.workouts)

		return this.props.data.loading === true
		? <p> Loading </p>
		:	<GridComponent onPlaceSelect={(place)=>{
			console.log("place---");
			console.log(place);
			console.log(this.props);
			this.props.data.refetch({
				latLng : place.address
			});
			return null;
		}} workouts={this.props.data.workouts || []}
		markers={this.props.data.workouts ?  this.props.data.workouts.map(i=>({
			title : i.title,
			position : {
				lat : parseFloat(i.lat),
				lng : parseFloat(i.lng)
			}
		})) : []} />
	}
};

const LAT_LNG = "39.292013,-76.653072";
const GET_WORKOUTS = gql`
  query getWorkouts($latLng: String!){
			workouts(latLng: $latLng){title, date, lat, lng , time, location, author, contentSnippet, tags, day, image, avatar, id }
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
