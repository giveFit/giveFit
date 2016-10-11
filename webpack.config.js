
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: 'app/index.html',
  filename: 'index.html',
});

var compiler = webpack({
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    "./app/index.js",
    ],
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
        loaders: ["babel"]
      }
    ]
  },
   plugins: [
   new webpack.HotModuleReplacementPlugin(),
   HTMLWebpackPluginConfig
 ],
});

module.exports = compiler;
