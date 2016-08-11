import React from 'react';
import { bindActionCreators, createStore, applyMiddleware } from "redux";
import { Provider, connect } from "react-redux";
import { queryReducer } from "../reducers/reducer.js";
import thunkMiddleware from "redux-thunk";
import MainToolbar from './MainToolbar';
import GridContainer from '../containers/GridContainer';

const Home = React.createClass({
	render() {
		return(
			<div>
				<MainToolbar />
				<GridContainer /> 
			</div>
		)
	}
})

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore)

const TrialComponent = React.createClass({
	render: () => {
		return(
			<Provider store={createStoreWithMiddleware(queryReducer)}>
				<Home />
			</Provider>
		)
	}
}) 

module.exports = TrialComponent;