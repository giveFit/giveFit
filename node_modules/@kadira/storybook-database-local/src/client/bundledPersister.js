import lowdb from 'lowdb';
import lodash from 'lodash';
import Database from '../shared/database';

export default class StaticFilePersister {
  constructor({ url }) {
    this.url = url;
    this.db = null;
    this.pending = [];
    this._initDB();
  }

  set(collection, item) {
    return new Promise((resolve, reject) => {
      reject(new Error('cannot modify data on read-only database'));
    });
  }

  get(collection, query, options) {
    if (!this.db) {
      return this._enqueue(collection, query, options);
    }
    return new Promise((resolve, reject) => {
      const res = this.db.get(collection, query, options.sort, options.limit);
      resolve(res);
    });
  }

  _initDB() {
    return fetch(this.url)
      .then(res => res.json())
      .then(data => this._setData(data))
      .then(() => this._flushQueue())
      .catch(err => console.error(err));
  }

  _setData(data) {
    const db = lowdb('storybook-addon-data', {}, lodash);
    db.defaults(data).value();
    this.db = new Database(db);
  }

  _enqueue(collection, query, options) {
    return new Promise((resolve, reject) => {
      const request = { collection, query, options };
      this.pending.push({ request, resolve, reject });
    });
  }

  _flushQueue() {
    const pending = this.pending;
    this.pending = [];
    pending.forEach(job => {
      const { collection, query, options } = job.request;
      this.get(collection, query, options)
        .then(res => job.resolve(res))
        .catch(err => job.reject(err));
    });
  }
}
