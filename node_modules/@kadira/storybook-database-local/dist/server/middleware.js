'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (dbPath) {
  var db = new _database2.default((0, _lowdb2.default)(dbPath, { storage: _fileAsync2.default }));

  var router = new _express.Router();
  router.use(_bodyParser2.default.json());

  router.post('/get', function (req, res) {
    var _req$body = req.body;
    var collection = _req$body.collection;
    var query = _req$body.query;
    var sort = _req$body.sort;
    var limit = _req$body.limit;

    var out = db.get(collection, query, sort, limit);
    res.send({ data: out });
    res.end();
  });

  router.post('/set', function (req, res) {
    var _req$body2 = req.body;
    var collection = _req$body2.collection;
    var item = _req$body2.item;

    var out = db.set(collection, item);
    res.send({ data: out });
    res.end();
  });

  return router;
};

var _express = require('express');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _lowdb = require('lowdb');

var _lowdb2 = _interopRequireDefault(_lowdb);

var _fileAsync = require('lowdb/lib/file-async');

var _fileAsync2 = _interopRequireDefault(_fileAsync);

var _database = require('../shared/database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }