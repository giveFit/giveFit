import React from "react";
import { connect } from "react-redux";
import { getGraph } from "../actions/actions.js";
import GridComponent from '../components/GridComponent';
 
let Grid = React.createClass({
	componentDidMount() {
		this.props.dispatch(
			getGraph("{workouts{title,date,time,location,author,contentSnippet,tags,day,image,avatar,id}}")
		);
	},
	render() {
		let dispatch = this.props.dispatch;
		let dataFromState = this.props.store.get("data").toArray();
		let workouts = this.props.store.get("data").toArray();
		console.log(workouts)
		

		return (
			<GridComponent workouts={workouts} />
		)
	}
});

const mapStateToProps = (state) => {
	return {
		store: state
	}
};

const GridContainer = connect(
	mapStateToProps
)(Grid);

export default GridContainer