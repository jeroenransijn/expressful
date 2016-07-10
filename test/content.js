'use strict';
const assert = require('chai').assert;
const Content = require('../lib/helpers/content');

const mixins = {
  rename: function rename (parent, key) {
    parent['foo'] = parent[key];
    delete parent[key];
  },
  assign: function assign (parent, key, transform, mixins) {
    Object.assign(parent, transform(parent[key], mixins));
    delete parent[key];
  }
};

describe('Content', () => {
  it('should be an object', () => {
    assert.typeOf(Content, 'object');
  });

  describe('.transform', () => {

    it('should be a function', () => {
      assert.typeOf(Content.transform, 'function');
    });

    it('should return an object for convenience', () => {
      const result = Content.transform({});
      assert.typeOf(result, 'object');
    });

    it('should have side effects', () => {
      const obj = {
        foo: 'bar'
      };
      const result = Content.transform(obj);
      assert.equal(obj, result);
    });

    it('should execute mixins', () => {
      const obj = {
        __rename: 'bar'
      };

      Content.transform(obj, mixins);

      assert.equal(obj['foo'], 'bar');
    });

    it('should support nested object', () => {
      const obj = {
        one: {
          two: {
            __assign: { a: 'hello' },
            b: 'world'
          }
        }
      };

      const result = Content.transform(obj, mixins);

      assert.equal(obj, result);
      assert.equal(`${obj.one.two.a} ${obj.one.two.b}`, 'hello world');
    });

    it('should have be able to support mixins that use transform and mixins arguments', () => {
      const obj = {
        one: {
          two: {
            __assign: { __rename: 'bar' },
            stay: 'here'
          }
        }
      };

      const result = Content.transform(obj, mixins);

      assert.equal(obj, result);
      assert.equal(obj.one.two.foo, 'bar');
      assert.equal(obj.one.two.stay, 'here');
    });
  });
});
