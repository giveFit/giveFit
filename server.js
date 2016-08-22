var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var express = require('express');
var graphqlHTTP = require('express-graphql');
var graphql = require('graphql');

//Material UI
global.navigator = { navigator: 'all' };

var schema = require('./app/data/schema');
var compiler = require('./webpack.config');

var graphQLServer = express();
graphQLServer.use('/', graphqlHTTP({ schema: schema, graphiql: true }));
graphQLServer.listen(8080);
console.log("The GraphQL Server is running.")

var app = new WebpackDevServer(compiler, {
 contentBase: "/public/",
 proxy: {"/graphql": `http://localhost:${8080}`},
 publicPath: "/static/",
 stats: {colors: true}
});
app.use("/", express.static("static"));
app.listen(3000);
console.log("The App Server is running.")