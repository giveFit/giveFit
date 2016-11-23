import React from 'react';
import { render } from 'react-dom';
import { browserHistory, IndexRoute, Router, Route } from 'react-router';

//Local imports
import routes from './config/routes';
import client from '../apollo';

//Material UI qualms
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from "react-tap-event-plugin";

import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'

injectTapEventPlugin();

//Wrap the app with our theme provider
const Application = () => (
  <MuiThemeProvider>
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
