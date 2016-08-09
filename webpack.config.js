var webpack = require('webpack');

var compiler = webpack({
  devtool: "inline-source-map",
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