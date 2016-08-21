import React from 'react';
import ReactRouter, { Router, Route, browserHistory, IndexRoute } from 'react-router';

import HomeContainer from '../components/Home/HomeContainer';
import GridContainerWithData from '../components/Feed/GridContainer';
import MainToolbar from '../components/Header/MainToolbar';


const routes = (
	<Route path='/' component={MainToolbar}>
		<IndexRoute component={HomeContainer} />
		<Route path='app' component={GridContainerWithData} />
	</Route>
)


export default routes;