var WebpackDevServer = require('webpack-dev-server');
var express = require('express');

//Material UI
global.navigator = { navigator: 'all' };

var compiler = require('./webpack.config');
var config = require('./config');

const APP_PORT = 3000;

var app = new WebpackDevServer(compiler, {
 contentBase: "/public/",
 proxy: { "/graphql": config.scapholdUrl },
 publicPath: "/static/",
 stats: {colors: true}
});

app.use("/", express.static("static"));
app.listen(APP_PORT);
console.log(`The App Server is running on http://localhost: ${APP_PORT}`)
