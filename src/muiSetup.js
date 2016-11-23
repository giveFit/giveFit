import React from 'react';
import { browserHistory, IndexRoute, Router, Route } from 'react-router';

//Mui reqs
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from "react-tap-event-plugin";

//local
import routes from './config/routes';

injectTapEventPlugin();

const SetUpMuiTheme = () => (
  <MuiThemeProvider>
    <Router
    	history={browserHistory}
    	routes={routes}
     />
  </MuiThemeProvider>
);

export default SetUpMuiTheme;