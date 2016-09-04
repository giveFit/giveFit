"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Database = function () {
  function Database(db) {
    _classCallCheck(this, Database);

    this.db = db;
  }

  _createClass(Database, [{
    key: "get",
    value: function get(collection, query, sort, limit) {
      // if the database doesn't exist, add the document
      // and return the inserted document as the result.
      if (!this.db.has(collection).value()) {
        return [];
      }
      // If the sort param is not given, use the DB interface
      if (!sort) {
        return this.db.get(collection).filter(query).take(limit).value();
      }
      // The db does not support sorting by multiple keys, get all data
      // and sort it by each key (and its order) and then apply the limit
      var allDocs = this.db.get(collection).filter(query).value();
      var sorted = Object.keys(sort).reduce(function (unsorted, key) {
        return unsorted.sort(function (x, y) {
          var order = sort[key];
          return x[key] > y[key] ? order * 1 : order * -1;
        });
      }, allDocs);
      // apply the limit after sorting
      return sorted.slice(0, limit);
    }
  }, {
    key: "set",
    value: function set(collection, item) {
      // if the database doesn't exist, add the item
      // and return the inserted item as the result.
      if (!this.db.has(collection).value()) {
        this.db.set(collection, [item]).value();
        return item;
      }
      // if the item already exists in the database, update it
      if (this.db.get(collection).find({ id: item.id }).value()) {
        this.db.get(collection).find({ id: item.id }).assign(item).value();
        return item;
      }
      // If the item is not available in the database, insert it
      var coll = this.db.get(collection).value();
      this.db.set(collection, [].concat(_toConsumableArray(coll), [item])).value();
      return item;
    }
  }]);

  return Database;
}();

exports.default = Database;