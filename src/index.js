import React from 'react';
import { render } from 'react-dom';
import { browserHistory, IndexRoute, Router, Route } from 'react-router';

//Local imports
import routes from './config/routes';
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


//Wrap the app with our theme provider
const Application = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <Router
    	history={browserHistory}
    	routes={routes}
     />
  </MuiThemeProvider>
);

const mountNode = document.querySelector('#root');

render(
	<ApolloProvider client={client}>
		<Application />
	</ApolloProvider>,
	mountNode
);
