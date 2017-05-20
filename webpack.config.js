const getConfig = require('hjs-webpack')
const webpack = require('webpack')
const path = require('path')
const dotenv = require('dotenv')

const isDevelopment = process.env.NODE_ENV === 'development'

const envVariables = dotenv.config().parsed

const config = getConfig({
  // entry point for the app
  in: path.join(__dirname, 'src/index.js'),

  // Name or full path of output directory commonly named `www` or `public`.
  // This is where your fully static site should end up for simple deployment.
  out: path.join(__dirname, 'dist'),

  // This will destroy and re-create your `out` folder before building so you
  // always get a fresh folder. Usually you want this but since it's destructive
  // we make it false by default
  clearBeforeBuild: true,
  devtool: 'source-map',
  devServer: {
    proxy: {
      context: '/api',
      options: {
        target: envVariables.SCAPHOLD_URL,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },

  html: function (context) {
    return {
      'index.html': context.defaultTemplate({
        title: 'givefit',
        head: `
          <script src="https://use.fontawesome.com/c37c106dc7.js"></script>
          </style><script src="https://maps.googleapis.com/maps/api/js?key=${envVariables.GOOGLE_API}=places" ></script>
        `,
        publicPath: isDevelopment ? 'http://localhost:3000/' : '',
        meta: {
          'name': 'givefit',
          'description': 'Find your free fitness community',
        },
      }),
    }
  },
})

// Set Env Variables
config.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    __NODE_ENV__: JSON.stringify(process.env.NODE_ENV),
    AUTH0_CLIENT_ID: JSON.stringify(envVariables.AUTH0_CLIENT_ID),
    AUTH0_DOMAIN: JSON.stringify(envVariables.AUTH0_DOMAIN),
    FILESTACK_API: JSON.stringify(envVariables.FILESTACK_API),
    GOOGLE_API: JSON.stringify(envVariables.GOOGLE_API),
    SCAPHOLD_URL: JSON.stringify(envVariables.SCAPHOLD_URL),
    FOURSQUARE_CLIENT_ID_KEY: JSON.stringify(envVariables.FOURSQUARE_CLIENT_ID_KEY),
    FOURSQUARE_CLIENT_SECRET_KEY: JSON.stringify(envVariables.FOURSQUARE_CLIENT_SECRET_KEY),
  },
}))

config.resolve.modules = [
  path.join(__dirname, 'src'),
  path.join(__dirname, 'node_modules'),
]

module.exports = config
