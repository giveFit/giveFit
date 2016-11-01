import React from 'react';
import ReactRouter, { Router, Route, browserHistory, IndexRoute } from 'react-router';

import GridContainerWithData from '../components/Feed/GridContainer';
import MainToolbar from '../components/Header/MainToolbar';


/*Keep some front-end principles in place
	React works well, building app, data flows down. Events bubble up
	Keep as few connected components as possible, often at route data
	(high in the foodchain) adhere to the idea that ui is a function of state
	ui should never be drawn from anything that's not state, 
	ui is dependent variable

	how do i use the info from that action to get to a new state
	do unit testing 

	see how far uni-directional data flow pattern can be used w/ graphql
	*/
const routes = (
	<Route path='/' component={MainToolbar}>
		<IndexRoute component={GridContainerWithData} />
	</Route>
)


export default routes;