import ApolloClient, { createNetworkInterface } from 'apollo-client';
import apolloConfig from './apolloConfig';

const networkInterface = createNetworkInterface(apolloConfig.scapholdUrl);
networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }
    if (localStorage.getItem('token')) {
      req.options.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    next();
  }
}]);

const client = new ApolloClient({
  networkInterface
});

export default client;
