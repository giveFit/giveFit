'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Collection = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Database = function () {
  function Database(_ref) {
    var persister = _ref.persister;

    _classCallCheck(this, Database);

    this.persister = persister;
  }

  _createClass(Database, [{
    key: 'getCollection',
    value: function getCollection(name) {
      return new Collection(this.persister, name);
    }
  }]);

  return Database;
}();

exports.default = Database;

var Collection = exports.Collection = function () {
  function Collection(persister, name) {
    _classCallCheck(this, Collection);

    this.persister = persister;
    this.name = name;
  }

  _createClass(Collection, [{
    key: 'set',
    value: function set(item) {
      if (!item.id) {
        var itemWithId = Object.assign({}, item, { id: _uuid2.default.v4() });
        return Promise.resolve(this.persister.set(this.name, itemWithId));
      }
      return Promise.resolve(this.persister.set(this.name, item));
    }
  }, {
    key: 'get',
    value: function get(query) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return Promise.resolve(this.persister.get(this.name, query, options));
    }
  }]);

  return Collection;
}();