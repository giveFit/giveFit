import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'
import ApolloClient, { createNetworkInterface } from 'apollo-client'

import { scapholdUrl } from '../apolloConfig'

/*
  Creates a subscription ready Apollo Client instance
  Note that scaphldUrl expects the url without the http:// or wss://
*/

export default () => {
  // Create regular NetworkInterface by using apollo-client's API:
  const networkInterface = createNetworkInterface({
    uri: `https://${scapholdUrl}`,
  })

  networkInterface.use([{
    applyMiddleware (req, next) {
      // Easy way to add authorization headers for every request
      if (!req.options.headers) {
        req.options.headers = {}  // Create the header object if needed.
      }

      // assumes we have logged in and stored the returned user token in local storage
      req.options.headers['authorization'] = window.localStorage.getItem('scaphold_user_token') || null

      next()
    },
  }])

  // Create WebSocket client
  const wsClient = new SubscriptionClient(`wss://${scapholdUrl}`, {
    reconnect: true,
  })

  // Extend the network interface with the WebSocket
  const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
      networkInterface,
      wsClient
  )

  // Finally, create your ApolloClient instance with the modified network interface
  const apolloClient = new ApolloClient({
    networkInterface: networkInterfaceWithSubscriptions,
    initialState: {},
  })

  return apolloClient
}
