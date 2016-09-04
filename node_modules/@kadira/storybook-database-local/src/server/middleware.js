import { Router } from 'express';
import bodyParser from 'body-parser';
import lowdb from 'lowdb';
import fileAsyncStorage from 'lowdb/lib/file-async';
import Database from '../shared/database';

export default function (dbPath) {
  const db = new Database(lowdb(dbPath, { storage: fileAsyncStorage }));

  const router = new Router();
  router.use(bodyParser.json());

  router.post('/get', function (req, res) {
    const { collection, query, sort, limit } = req.body;
    const out = db.get(collection, query, sort, limit);
    res.send({ data: out });
    res.end();
  });

  router.post('/set', function (req, res) {
    const { collection, item } = req.body;
    const out = db.set(collection, item);
    res.send({ data: out });
    res.end();
  });

  return router;
}
