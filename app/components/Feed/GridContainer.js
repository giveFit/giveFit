import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import GridComponent from './GridComponent';

class GridContainer extends React.Component {

	render() {
		console.log("props", this.props)
		console.log("error", this.props.data.error)
		console.log("loading",this.props.data.loading)
		if(this.props.data.loading === true){
			console.log("loading",this.props.data.viewer)	
		}else{
			console.log("post loading workouts",this.props.data.viewer.getWorkoutsInsideCircleByLocation)
		}
		

		return this.props.data.loading === true ? <p> loading </p> 
		: <GridComponent onPlaceSelect={(place)=>{
			console.log("place---");
			console.log(place);
			console.log(this.props);
			this.props.data.refetch({
				latLng : place.address
			});
			return null;
		}}

		workouts={this.props.data.viewer.getWorkoutsInsideCircleByLocation || []}
		markers={(this.props.data.viewer.getWorkoutsInsideCircleByLocation && !this.props.data.loading) ?  this.props.data.viewer.getWorkoutsInsideCircleByLocation.map(i=>({
			title : i.title,
			position : {
				lat : parseFloat(i.location.lat),
				lon : parseFloat(i.location.lon)
			}
		})) : []} />

	};
}

const circle = 
{
	"center": {
	    "lat": 37.769040,
	    "lon": -122.483519
	},
	"radius": 9985160,
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
