import React from 'react';
import ReactRouter, { Router, Route, browserHistory, IndexRoute, IndexRedirect } from 'react-router';
import AuthService from '../utils/AuthService';

//Components
import GridContainerWithData from '../components/Feed/GridContainer';
import MainToolbar from '../components/Header/MainToolbar';
import LandingPageContainerWithData from '../components/Landing/index';
import HomeContainerWithData from '../components/Home/Home';
import Login from '../components/Login/Login';

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

const auth = new AuthService(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__);
// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' })
  }
}

const routes = (
	<Route path='/' component={MainToolbar} auth={auth}>
		<IndexRoute component={LandingPageContainerWithData} />
		<Route path="home" component={HomeContainerWithData} onEnter={requireAuth} />
		<Route path="login" component={Login} />
		<Route path="app" component={GridContainerWithData}  />
	</Route>
)


export default routes;
