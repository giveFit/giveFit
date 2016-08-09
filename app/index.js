import React from 'react';
import { render } from 'react-dom';
import routes from './config/routes';
import { browserHistory, Router } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

var Application = () => (
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <Router
    	history={browserHistory}
		routes={routes}
	/>
  </MuiThemeProvider>
);

render(<Application />, document.getElementById('app'));
