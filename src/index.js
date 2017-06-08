import 'babel-core/register'
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import { ApolloProvider } from 'react-apollo'
import apolloClient from './apollo'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import muiTheme from './muiTheme'
import injectTapEventPlugin from 'react-tap-event-plugin'

import { browserHistory, Router } from 'react-router'

import App from 'App/'

// Logged in Components
import Explore from 'Explore/'
import Profile from 'Profile/'
import Data from 'Data/'
import AddActivityPageWithData from 'Explore/AddActivity/addActivityPage'

import './base.css'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

const customTheme = getMuiTheme(muiTheme)
const routes = {
  path: '/',
  component: App,
  indexRoute: { component: Explore, defaultLat: 39.2904, defaultLng: -76.6122 },
  childRoutes: [
    { path: 'explore', component: Explore, defaultLat: 39.2904, defaultLng: -76.6122 },
    { path: 'new-york', component: Explore, defaultLat: 40.7128, defaultLng: -74.0059 },
    { path: 'profile', component: Profile },
    { path: 'data', component: Data },
    { path: 'add-workout', component: AddActivityPageWithData, defaultLat: 39.2904, defaultLng: -76.6122 },
  ],
}

const Application = () => (
  <MuiThemeProvider muiTheme={customTheme}>
    <Router history={browserHistory} routes={routes} />
  </MuiThemeProvider>
)

ReactDOM.render(
  <ApolloProvider client={apolloClient()}>
    <Application />
  </ApolloProvider>,
  document.getElementById('root')
)
