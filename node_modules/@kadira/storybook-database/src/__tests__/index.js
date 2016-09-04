import { expect } from 'chai';
import sinon from 'sinon';
import Database, { Collection } from '../';

describe('Database', function () {
  let persister = null;
  let database = null;

  beforeEach(function () {
    persister = { set: sinon.spy(), get: sinon.spy() };
    database = new Database({ persister });
  });

  describe('getCollection', function () {
    it('should return a Collection instance', function () {
      const coll = database.getCollection('test-collection');
      expect(coll.name).to.equal('test-collection');
      expect(coll.persister).to.equal(persister);
    });
  });
});

describe('Collection', function () {
  let persister = null;
  let collection = null;

  beforeEach(function () {
    persister = { set: sinon.spy(), get: sinon.spy() };
    collection = new Database({ persister }).getCollection('test-collection');
  });

  describe('set', function () {
    it('should call persister method', function () {
      const item = {id: 1};
      collection.set(item);
      expect(persister.set.calledOnce).to.equal(true);
      expect(persister.set.calledWith(collection.name, item)).to.equal(true);
    });
    it('should set an id if its missing', function () {
      const result = collection.set({foo: 'bar'});
      expect(persister.set.calledOnce).to.equal(true);
      expect(persister.set.args[0][0]).to.equal(collection.name);
      expect(persister.set.args[0][1].id).to.be.a('string');
      expect(persister.set.args[0][1].foo).to.equal('bar');
      expect(result).to.be.a('promise');
    });
  });

  describe('get', function () {
    it('should call persister method', function () {
      const result = collection.get('test-query', 'test-options');
      expect(persister.get.calledOnce).to.equal(true);
      expect(persister.get.args[0][0]).to.equal(collection.name);
      expect(persister.get.args[0][1]).to.equal('test-query');
      expect(persister.get.args[0][2]).to.equal('test-options');
      expect(result).to.be.a('promise');
    });
  });
});
