var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var express = require('express');
var graphql = require('graphql');
var graphqlTools = require('graphql-tools');
var apollo = require('apollo-server');
var apolloExpress = apollo.apolloExpress;
var graphiqlExpress = apollo.graphiqlExpress;
var bodyParser = require('body-parser')

//Material UI
global.navigator = { navigator: 'all' };

var schema = require('./app/data/schema');
var compiler = require('./webpack.config');

//GraphQL Stuff
var PORT = 3010;

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
 proxy: {
 	"/graphql": `http://localhost:${3010}`
 },
 publicPath: "/static/",
 stats: {colors: true}
});

app.use("/", express.static("static"));
app.listen(3000);
console.log("The App Server is running.")
