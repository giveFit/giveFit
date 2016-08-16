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

//Material UI qualms
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from "react-tap-event-plugin";

injectTapEventPlugin();

//Create store middleware
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);

const Application = () => (
  <MuiThemeProvider>
    <Router
    	history={browserHistory}
    	routes={routes}
     />
  </MuiThemeProvider>
);
render(
	<Provider store={createStoreWithMiddleware(queryReducer)}>
		<Application />
	</Provider>, 
	document.getElementById('app')
);
