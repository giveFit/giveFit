'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DevServerPersister = function () {
  function DevServerPersister(_ref) {
    var url = _ref.url;

    _classCallCheck(this, DevServerPersister);

    this.url = url;
    this.headers = { 'content-type': 'application/json' };
  }

  _createClass(DevServerPersister, [{
    key: 'set',
    value: function set(collection, item) {
      var body = JSON.stringify({ collection: collection, item: item });
      var params = { body: body, method: 'post', headers: this.headers };
      return fetch(this.url + '/set', params).then(function (res) {
        return res.json();
      }).then(function (res) {
        return res.data;
      });
    }
  }, {
    key: 'get',
    value: function get(collection, query, options) {
      var sort = options.sort;
      var limit = options.limit;

      var body = JSON.stringify({ collection: collection, query: query, sort: sort, limit: limit });
      var params = { body: body, method: 'post', headers: this.headers };
      return fetch(this.url + '/get', params).then(function (res) {
        return res.json();
      }).then(function (res) {
        return res.data;
      });
    }
  }]);

  return DevServerPersister;
}();

exports.default = DevServerPersister;