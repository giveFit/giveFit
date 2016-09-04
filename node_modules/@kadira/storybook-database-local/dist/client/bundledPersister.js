'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lowdb = require('lowdb');

var _lowdb2 = _interopRequireDefault(_lowdb);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _database = require('../shared/database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StaticFilePersister = function () {
  function StaticFilePersister(_ref) {
    var url = _ref.url;

    _classCallCheck(this, StaticFilePersister);

    this.url = url;
    this.db = null;
    this.pending = [];
    this._initDB();
  }

  _createClass(StaticFilePersister, [{
    key: 'set',
    value: function set(collection, item) {
      return new Promise(function (resolve, reject) {
        reject(new Error('cannot modify data on read-only database'));
      });
    }
  }, {
    key: 'get',
    value: function get(collection, query, options) {
      var _this = this;

      if (!this.db) {
        return this._enqueue(collection, query, options);
      }
      return new Promise(function (resolve, reject) {
        var res = _this.db.get(collection, query, options.sort, options.limit);
        resolve(res);
      });
    }
  }, {
    key: '_initDB',
    value: function _initDB() {
      var _this2 = this;

      return fetch(this.url).then(function (res) {
        return res.json();
      }).then(function (data) {
        return _this2._setData(data);
      }).then(function () {
        return _this2._flushQueue();
      }).catch(function (err) {
        return console.error(err);
      });
    }
  }, {
    key: '_setData',
    value: function _setData(data) {
      var db = (0, _lowdb2.default)('storybook-addon-data', {}, _lodash2.default);
      db.defaults(data).value();
      this.db = new _database2.default(db);
    }
  }, {
    key: '_enqueue',
    value: function _enqueue(collection, query, options) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var request = { collection: collection, query: query, options: options };
        _this3.pending.push({ request: request, resolve: resolve, reject: reject });
      });
    }
  }, {
    key: '_flushQueue',
    value: function _flushQueue() {
      var _this4 = this;

      var pending = this.pending;
      this.pending = [];
      pending.forEach(function (job) {
        var _job$request = job.request;
        var collection = _job$request.collection;
        var query = _job$request.query;
        var options = _job$request.options;

        _this4.get(collection, query, options).then(function (res) {
          return job.resolve(res);
        }).catch(function (err) {
          return job.reject(err);
        });
      });
    }
  }]);

  return StaticFilePersister;
}();

exports.default = StaticFilePersister;