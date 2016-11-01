import React from 'react';
import { render } from 'react-dom';
import { browserHistory, IndexRoute, Router, Route } from 'react-router';

//Local imports
import { queryReducer } from './reducers/reducer';
import routes from './config/routes';
import configStore from './store/configStore';
import client from '../apollo';

//Material UI qualms
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from "react-tap-event-plugin";

import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'

injectTapEventPlugin();

//Create store middleware

console.log("client");
console.log(client);
console.log("client");

const Application = () => (
  <MuiThemeProvider>
    <Router
    	history={browserHistory}
    	routes={routes}
     />
  </MuiThemeProvider>
);

render(
	<ApolloProvider client={client}>
		<Application />
	</ApolloProvider>, 
	document.getElementById('app')
);