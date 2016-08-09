var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack');
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
});

var compiler = webpack({
  entry: "./app/index.js",
  output: {
    path: __dirname,
    filename: "bundle.js",
    publicPath: "/static"
  },
  module: {
    loaders: [
      { test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
});

module.exports = compiler;