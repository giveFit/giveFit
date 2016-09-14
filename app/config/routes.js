import React from 'react';
import ReactRouter, { Router, Route, browserHistory, IndexRoute } from 'react-router';

import HomeContainer from '../components/Home/HomeContainer';
import GridContainerWithData from '../components/Feed/GridContainer';
import MainToolbar from '../components/Header/MainToolbar';
import Blog from '../components/Blog/Blog';
import MapContainerWithData from '../components/Map/Map';


const routes = (
	<Route path='/' component={MainToolbar}>
		<IndexRoute component={HomeContainer} />
		<Route path='app' component={GridContainerWithData} />
		<Route path='blog' component={Blog} />
		<Route path='map' component={MapContainerWithData} />
	</Route>
)


export default routes;