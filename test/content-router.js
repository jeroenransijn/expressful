'use strict';
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const path = require('path');
const contentRouter = require('../lib/helpers/content-router');

const CONTENT_DIRECTORY = path.join(__dirname, '/content');

describe('contentRouter', () => {
  it('should be a function', () => {
    assert.typeOf(contentRouter, 'function');
  });

  it('should walk a directory', () => {
    contentRouter(CONTENT_DIRECTORY, (route) => {
      assert.typeOf(route, 'object');
      assert.typeOf(route.path, 'string');
      assert.typeOf(route.relativeFilePath, 'string');
      assert.typeOf(route.filePath, 'string');

      return (req, res, next) => {
        res.json({ hello: 'world' });
      }
    });
  });
});
