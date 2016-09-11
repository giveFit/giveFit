
var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack');
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: '/app/index.html',
  filename: 'index.html',
  googleMaps:true
});

var compiler = webpack({
  entry: "./app/index.js",
  devtool : "#source-map",
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
