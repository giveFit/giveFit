export default class DevServerPersister {
  constructor({ url }) {
    this.url = url;
    this.headers = { 'content-type': 'application/json' };
  }

  set(collection, item) {
    const body = JSON.stringify({ collection, item });
    const params = {body, method: 'post', headers: this.headers};
    return fetch(`${this.url}/set`, params)
      .then(res => res.json())
      .then(res => res.data);
  }

  get(collection, query, options) {
    const { sort, limit } = options;
    const body = JSON.stringify({ collection, query, sort, limit });
    const params = {body, method: 'post', headers: this.headers};
    return fetch(`${this.url}/get`, params)
      .then(res => res.json())
      .then(res => res.data);
  }
}
