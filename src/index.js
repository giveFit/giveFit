require('babel-core/register');
require('babel-polyfill');
import React from 'react';
import { render } from 'react-dom';
import { browserHistory, IndexRoute, Router, Route, routes, applyRouterMiddleware, hashHistory } from 'react-router';

//Local imports
import makeApolloClient from '../apollo';
import apolloConfig from '../apolloConfig';

//Material UI qualms
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

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
//Actually the profile route
import HomeContainerWithData from './components/App/Home/Home'
//API
import GraphiQLModule from './components/App/GraphiQL/GraphiQL';

//const auth = new AuthService(apolloConfig.auth0ClientId, apolloConfig.auth0Domain);
//const auth = new AuthService(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__);
// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' })
  }
}
const client = makeApolloClient(apolloConfig.scapholdUrl);
console.log('client', client)
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
      <Route path="/" component={HomeLoggedInWithData} />
      <Route path="/app" component={AppLoggedInWithData} />
      <Route path="/profile" component={HomeContainerWithData} />
      <Route path="/graphiql" component={GraphiQLModule} />
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
