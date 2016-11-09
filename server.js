var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var express = require('express');
var graphql = require('graphql');
var graphqlTools = require('graphql-tools');
var apollo = require('apollo-server');
var apolloExpress = apollo.apolloExpress;
var graphiqlExpress = apollo.graphiqlExpress;
var bodyParser = require('body-parser')
var proxyMiddleware = require('http-proxy-middleware');
var cors = require('cors');

//Material UI
global.navigator = { navigator: 'all' };

var schema = require('./app/data/schema');
var compiler = require('./webpack.config');

//GraphQL Stuff
var PORT = 8080;

var graphqlServer = express();

graphqlServer.use('/graphql', bodyParser.json(), apolloExpress({
  schema: schema
}));

graphqlServer.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));


graphqlServer.listen(PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${PORT}/graphql`
));

var app = new WebpackDevServer(compiler, {
 contentBase: "/public/",
 proxy: { "/graphql": config.scapholdUrl },
 publicPath: "/static/",
 stats: {colors: true}
});

/*app.use(proxyMiddleware('http://localhost:8080/graphql'));*/

app.use("/", express.static("static"));
app.listen(3000);
console.log("The App Server is running.")
