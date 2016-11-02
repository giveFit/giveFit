import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import GridComponent from './GridComponent';

class GridContainer extends React.Component {

	render() {
		
		//The GridComponent contains both the feed and the map
		return <GridComponent onPlaceSelect={(place)=>{
			console.log("place---");
			console.log(place);
			console.log(this.props);
			this.props.data.refetch({
				circle : 
				{
					"center": {
					    "lat": place.coordinates.lat,
					    "lon": place.coordinates.lng
					},
					"radius": 20000,
					"unit": "m"
				}
			});
			return null;
		}}

		//After loading the "viewer" becomes available
		workouts={(!this.props.data.loading && this.props.data.viewer.getWorkoutsInsideCircleByLocation) ? this.props.data.viewer.getWorkoutsInsideCircleByLocation : []}
		markers={(!this.props.data.loading && this.props.data.viewer.getWorkoutsInsideCircleByLocation) ?  this.props.data.viewer.getWorkoutsInsideCircleByLocation.map(i=>({
			title : i.title,
			position : {
				lat : parseFloat(i.location.lat),
				lng : parseFloat(i.location.lon)
			}
		})) : []} />

	};
}

const circle = 
{
	"center": {
	    "lat": 39.283402,
	    "lon": -76.612912
	},
	"radius": 20000,
	"unit": "m"
}

const GET_WORKOUTS = gql`
  query NearestWorkoutsByLocation($circle: _GeoCircleInput){
	viewer{
    getWorkoutsInsideCircleByLocation(circle: $circle){
      id
      title
      author
      avatar
      time
      contentSnippet
      image
      location{
        lat
        lon
      }
    }
  }
}
`;

const GridContainerWithData = graphql(GET_WORKOUTS, {
	options(props) {
		return {
		variables: {
			circle : circle
		}
	};
}})(GridContainer);

export default GridContainerWithData;
