import uuid from 'uuid';

export default class Database {
  constructor({ persister }) {
    this.persister = persister;
  }

  getCollection(name) {
    return new Collection(this.persister, name);
  }
}

export class Collection {
  constructor(persister, name) {
    this.persister = persister;
    this.name = name;
  }

  set(item) {
    if (!item.id) {
      const itemWithId = Object.assign({}, item, {id: uuid.v4()});
      return Promise.resolve(this.persister.set(this.name, itemWithId));
    }
    return Promise.resolve(this.persister.set(this.name, item));
  }

  get(query, options = {}) {
    return Promise.resolve(this.persister.get(this.name, query, options));
  }
}
