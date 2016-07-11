'use strict';
const chai = require('chai');
const assert = chai.assert;
// const expect = chai.expect;
// const should = chai.should();
const path = require('path');
const request = require('supertest');
const expressful = require('../');

const CONTENT_DIRECTORY = path.join(__dirname, '/content');

describe('app.serveContent()', () => {
  it('should be a function', () => {
    const app = expressful();
    assert.typeOf(app.serveContent, 'function');
  });

  it('should serve pages', (done) => {
    const app = expressful({
      viewsDirectory: __dirname + '/views'
    });

    app.serveContent({
      contentDirectory: CONTENT_DIRECTORY
    });

    app.start();

    request(app)
      .get('/homepage')
      .expect(200, /<h1>Homepage<\/h1>/, done);
  });
});
