import React from 'react';
import { render } from 'react-dom';
import { browserHistory, IndexRoute, Router, Route } from 'react-router';

//Redux stuff
import thunkMiddleware from "redux-thunk";
import { Provider } from 'react-redux';
import { bindActionCreators, createStore, applyMiddleware } from 'redux';

//Local imports
import { queryReducer } from './reducers/reducer';
import routes from './config/routes';
import configStore from './store/configStore';

//Material UI qualms
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from "react-tap-event-plugin";

import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'

injectTapEventPlugin();

//Create store middleware
/*const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);*/
const store = configStore()

const client = new ApolloClient({
  networkInterface: createNetworkInterface('http://localhost:8080/graphql'),
  queryTransformer: addTypename,
})

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
