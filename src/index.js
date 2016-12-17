import React from 'react';
import { render } from 'react-dom';
import { browserHistory, IndexRoute, Router, Route, routes, applyRouterMiddleware } from 'react-router';

//Local imports
//import routes from './config/routes';
import client from '../apollo';

//Material UI qualms
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import './styles/base.css';
import theme from './theme';
const muiTheme = getMuiTheme(theme);

import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import AuthService from './utils/AuthService';

//Not logged in Components
import GridContainerWithData from './components/Home/Feed/GridContainer';
import LandingPageContainerWithData from './components/Home/Landing/index';


//Logged in Components
import AppLoggedInWithData from './components/App/Feed/AppLoggedIn';
import HomeLoggedInWithData from './components/App/Landing/HomeLoggedIn';

const auth = new AuthService(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__);
// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' })
  }
}
//Wrap the app with our theme provider
const Application = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <Router
    	history={browserHistory}
    	routes={routes}
      render={
        applyRouterMiddleware()
      }
     >
      <Route path="/" component={LandingPageContainerWithData} auth={auth} />
      <Route path="/app" component={GridContainerWithData} auth={auth} />
      <Route path="/home-logged-in" component={HomeLoggedInWithData} auth={auth} />
      <Route path="/app-logged-in" component={AppLoggedInWithData} auth={auth} />
    </Router>
  </MuiThemeProvider>
);

const mountNode = document.querySelector('#root');

render(
	<ApolloProvider client={client}>
		<Application />
	</ApolloProvider>,
	mountNode
);
