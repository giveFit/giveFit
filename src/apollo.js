import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'
import ApolloClient, { createNetworkInterface } from 'apollo-client'

/*
  Creates a subscription ready Apollo Client instance
  Note that scaphldUrl expects the url without the http:// or wss://
*/

export default () => {
  // Create regular NetworkInterface by using apollo-client's API:
  const networkInterface = createNetworkInterface({
    uri: `https://${process.env.SCAPHOLD_URL}`,
  })

  networkInterface.use([{
    applyMiddleware (req, next) {
      // Easy way to add authorization headers for every request
      if (!req.options.headers) {
        req.options.headers = {}  // Create the header object if needed.
      }

      if (window.localStorage.getItem('scaphold_user_token')) {
        req.options.headers['Authorization'] = `Bearer ${window.localStorage.getItem('scaphold_user_token')}`
      }

      next()
    },
  }])

  // Create WebSocket client
  const wsClient = new SubscriptionClient(`wss://${process.env.SCAPHOLD_URL}`, {
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
