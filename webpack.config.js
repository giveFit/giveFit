
var webpack = require('webpack');

var compiler = webpack({
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    "./app/index.js",
    ],
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
  },
   plugins: [
   new webpack.HotModuleReplacementPlugin()
 ],
});

module.exports = compiler;