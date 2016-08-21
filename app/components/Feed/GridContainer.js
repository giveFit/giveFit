import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import GridComponent from './GridComponent';

class GridContainer extends React.Component {

	render() {
		console.log("props")
		console.log(this.props)
		const workouts = this.props.data.workouts;
		
		return (
			<GridComponent workouts={workouts} />
		)
	}
};

const GET_WORKOUTS = gql`
  query getWorkouts {
     workouts { title, date, time, location, author, contentSnippet, tags, day, image, avatar, id } 
  }
`;

const withWorkouts = graphql(GET_WORKOUTS);

const GridContainerWithData = withWorkouts(GridContainer)

export default GridContainerWithData;