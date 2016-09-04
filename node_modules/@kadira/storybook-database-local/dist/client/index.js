'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createDatabase;

var _storybookDatabase = require('@kadira/storybook-database');

var _storybookDatabase2 = _interopRequireDefault(_storybookDatabase);

var _bundledPersister = require('./bundledPersister');

var _bundledPersister2 = _interopRequireDefault(_bundledPersister);

var _devServerPersister = require('./devServerPersister');

var _devServerPersister2 = _interopRequireDefault(_devServerPersister);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createDatabase(_ref) {
  var url = _ref.url;
  var bundled = _ref.bundled;

  var persister = null;
  if (bundled) {
    persister = new _bundledPersister2.default({ url: url });
  } else {
    persister = new _devServerPersister2.default({ url: url });
  }

  return new _storybookDatabase2.default({ persister: persister });
}