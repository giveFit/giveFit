import 'babel-core/register'
import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, Route, routes, applyRouterMiddleware } from 'react-router'

// Local import
import makeApolloClient from '../apollo'
import apolloConfig from '../apolloConfig'

// Material UI qualms
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import theme from './theme'
import injectTapEventPlugin from 'react-tap-event-plugin'

import { ApolloProvider } from 'react-apollo'

// Logged in Components
import AppLoggedInWithData from './components/App/Feed/AppLoggedIn'
import HomeLoggedInWithData from './components/App/Landing/HomeLoggedIn'

// Actually the profile route
import HomeContainerWithData from './components/App/Home/Home'

// API
import GraphiQLModule from './components/App/GraphiQL/GraphiQL'

import 'styles/base.css'

const muiTheme = getMuiTheme(theme)

injectTapEventPlugin()

// @todo: is this needed? this isn't being called anywhere
// const auth = new AuthService(apolloConfig.auth0ClientId, apolloConfig.auth0Domain);
// const auth = new AuthService(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__);
// onEnter callback to validate authentication in private routes
// const requireAuth = (nextState, replace) => {
//   if (!auth.loggedIn()) {
//     replace({ pathname: '/login' })
//   }
// }

const client = makeApolloClient(apolloConfig.scapholdUrl)

// Wrap the app with our theme provider
const Application = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <Router
      history={browserHistory}
      routes={routes}
      render={
        applyRouterMiddleware()
      }
     >
      <Route path='/' component={HomeLoggedInWithData} />
      <Route path='/app' component={AppLoggedInWithData} />
      <Route path='/profile' component={HomeContainerWithData} />
      <Route path='/graphiql' component={GraphiQLModule} />
    </Router>
  </MuiThemeProvider>
)

render(
  <ApolloProvider client={client}>
    <Application />
  </ApolloProvider>,
  document.querySelector('#root')
)
