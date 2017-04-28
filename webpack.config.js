const getConfig = require('hjs-webpack')
const webpack = require('webpack')
const path = require('path')
const dotenv = require('dotenv')

const apolloConfig = require('./apolloConfig')
const isDevelopment = process.env.NODE_ENV === 'development'

const envVariables = dotenv.config()

const config = getConfig({
  // entry point for the app
  in: path.join(__dirname, 'src/index.js'),

  // Name or full path of output directory
  // commonly named `www` or `public`. This
  // is where your fully static site should
  // end up for simple deployment.
  out: path.join(__dirname, 'dist'),

  // This will destroy and re-create your
  // `out` folder before building so you always
  // get a fresh folder. Usually you want this
  // but since it's destructive we make it
  // false by default
  clearBeforeBuild: true,
  devtool: 'source-map',
  devServer: {
    proxy: {
      context: '/api',
      options: {
        target: apolloConfig.scapholdUrl,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },

  html: function (context) {
    return {
      'index.html': context.defaultTemplate({
        title: 'givefit',
        head: `
          <script src="https://use.fontawesome.com/c37c106dc7.js"></script>
          </style><script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBwOsxUEBGettfG4jFkxFNl2lt3s7dtYPc&libraries=places" ></script>
        `,
        publicPath: isDevelopment ? 'http://localhost:3000/' : '',
        meta: {
          'name': 'givefit',
          'description': 'Find your free fitness community'
        }
      })
    }
  }
})

// Set Env Variables
config.plugins.push(new webpack.DefinePlugin(
  Object.keys(envVariables)
    .reduce((memo, key) => {
      const val = JSON.stringify(envVariables[key])

      memo[`__${key.toUpperCase()}__`] = val

      return memo
    }, {
      __NODE_ENV__: JSON.stringify(process.env.NODE_ENV)
    })
  )
)

config.resolve.root = [
  path.join(__dirname, 'src'),
  path.join(__dirname, 'node_modules')
]

module.exports = config
