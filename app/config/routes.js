import React from 'react';
import ReactRouter from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';


import { Router, Route, browserHistory, IndexRoute } from 'react-router';


import Main from '../components/Main';
import TrialComponent from '../components/Home';

injectTapEventPlugin();

var routes = (
    <Route path='/' component={Main}>
      <IndexRoute component={TrialComponent} />
    </Route>
);

export default routes;