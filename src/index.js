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

import App from 'App/index'

// Logged in Components
import Landing from './components/App/Landing/index'
import Feed from './components/App/Feed/index'
// Actually the profile route
import Profile from './components/App/Profile/index'

import 'styles/index.css'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

const customTheme = getMuiTheme(muiTheme)
const routes = {
  path: '/',
  component: App,
  indexRoute: { component: Landing },
  childRoutes: [
    { path: 'app', component: Feed },
    { path: 'profile', component: Profile },
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
