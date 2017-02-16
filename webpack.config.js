const NODE_ENV = process.env.NODE_ENV;
const dotenv = require('dotenv');
const scapholdUrl = require('./apolloConfig').scapholdUrl;
const proxy = require('http-proxy-middleware');
const configKeys = require('./configKeys');


const webpack = require('webpack');
const fs      = require('fs');
const path    = require('path'),
      join    = path.join,
      resolve = path.resolve;

const getConfig = require('hjs-webpack');

const isDev  = NODE_ENV === 'development';
const isTest = NODE_ENV === 'test';

const root    = resolve(__dirname);
const src     = join(root, 'src');
const modules = join(root, 'node_modules');
const dest    = join(root, 'dist');

var config = getConfig({
  isDev: isDev,
  in: join(src, 'index.js'),
  out: dest,
  devServer: {
    proxy: {
      context: "/api",
      options: {
        target: scapholdUrl,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  html: function (context) {
    return {
      'index.html': context.defaultTemplate({
        title: 'givefit',
        head: `<style> html,body, #root { width: 100%; height : 100%;  }  .__app__main{
				  display : flex;
				  flex-direction : column;
				  height : 100%;
				}
				.__app__header{
				}
				.__app__body__container{
				  display : flex;
				  flex : 1;
				  height : 100%;

				}
				.__app__body__container__left{

				  flex : 1;
				}
				 </style><script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDaqZIUzhyOdPDlsVjkdLbuWj89F3gNCMg&libraries=places" ></script>`,
        publicPath: isDev ? 'http://localhost:3000/' : '',
        meta: {
          'name': 'givefit',
          'description': 'Find your free fitness community'
        }
      })
    }
  }
});

// ENV variables
const dotEnvVars = dotenv.config();
const environmentEnv = dotenv.config({
  path: join(root, 'config', `${NODE_ENV}.config.js`),
  silent: true,
});
const envVariables =
    Object.assign({}, dotEnvVars, environmentEnv);

const defines =
  Object.keys(envVariables)
  .reduce((memo, key) => {
    const val = JSON.stringify(envVariables[key]);
    memo[`__${key.toUpperCase()}__`] = val;
    return memo;
  }, {
    __NODE_ENV__: JSON.stringify(NODE_ENV)
  });

config.plugins = [
  new webpack.DefinePlugin(defines)
].concat(config.plugins);
// END ENV variables

// CSS modules
const cssModulesNames = `${isDev ? '[path][name]__[local]__' : ''}[hash:base64:5]`;

const matchCssLoaders = /(^|!)(css-loader)($|!)/;

const findLoader = (loaders, match) => {
  const found = loaders.filter(l => l && l.loader && l.loader.match(match))
  return found ? found[0] : null;
}
// existing css loader
const cssloader =
  findLoader(config.module.loaders, matchCssLoaders);

const newloader = Object.assign({}, cssloader, {
  test: /\.module\.css$/,
  include: [src],
  loader: cssloader.loader.replace(matchCssLoaders, `$1$2?modules&localIdentName=${cssModulesNames}$3`)
})
config.module.loaders.push(newloader);
cssloader.test = new RegExp(`^(?!.*(module|bootstrap)).*${cssloader.test.source}`)
cssloader.loader = newloader.loader

config.module.loaders.push({
  test: /bootstrap\.css$/,
  include: [modules],
  loader: 'style-loader!css-loader'
})

// postcss
config.postcss = [].concat([
  require('precss')({}),
  require('autoprefixer')({}),
  require('cssnano')({})
])
// END postcss

// Roots
config.resolve.root = [src, modules]
config.resolve.alias = {
  'css': join(src, 'styles'),
  'containers': join(src, 'containers'),
  'components': join(src, 'components'),
  'utils': join(src, 'utils'),
  'styles': join(src, 'styles')
}
// end Roots

// Testing
if (isTest) {
  config.externals = {
    'react/addons': true,
    'react/lib/ReactContext': true,
    'react/lib/ExecutionEnvironment': true,
  }
  config.module.noParse = /[/\\]sinon\.js/;
  config.resolve.alias['sinon'] = 'sinon/pkg/sinon';

  config.plugins = config.plugins.filter(p => {
    const name = p.constructor.toString();
    const fnName = name.match(/^function (.*)\((.*\))/)

    const idx = [
      'DedupePlugin',
      'UglifyJsPlugin'
    ].indexOf(fnName[1]);
    return idx < 0;
  })
}
// End Testing

module.exports = config;
