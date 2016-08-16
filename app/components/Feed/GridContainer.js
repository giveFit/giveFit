import React from "react";
import { connect } from "react-redux";
import { getGraph } from "../../actions/actions.js";
import GridComponent from './GridComponent';
import Immutable from 'immutable';
 
let GridContainer = React.createClass({
	componentDidMount() {
		this.props.dispatch(
			getGraph("{workouts{title,date,time,location,author,contentSnippet,tags,day,image,avatar,id}}")
		);
	},
	render() {
		let dispatch = this.props.dispatch;
		let workouts = this.props.store.get("data").toArray();
		/*console.log("container workouts");
		console.log(workouts);
		console.log("container workouts");*/
	
		return (
			<GridComponent workouts={workouts} />
		)
	}
});

const mapStateToProps = (state) => {
/*	console.log(state);*/
	return { store: state }
};

export default connect(
	mapStateToProps
)(GridContainer);