import React from 'react';
import ReactRouter from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

import { Router, Route, browserHistory, IndexRoute } from 'react-router';


import Main from '../components/Main';
import TrialComponent from '../components/Home';

injectTapEventPlugin();

var routes = (
    <Route path='/' component={Main}>
      <IndexRoute component={TrialComponent} />
    </Route>
);

var Application = () => (
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <Router
    history={browserHistory}
		routes={routes}
	/>
  </MuiThemeProvider>
);

module.exports = Application;