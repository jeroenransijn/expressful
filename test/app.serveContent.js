'use strict';
const chai = require('chai');
const assert = chai.assert;
// const expect = chai.expect;
// const should = chai.should();
const path = require('path');
const request = require('supertest');
const expressful = require('../');

const VIEWS_DIRECTORY =  path.join(__dirname, '/views');
const CONTENT_DIRECTORY = path.join(__dirname, '/content');

describe('app.serveContent()', () => {
  it('should be a function', () => {
    const app = expressful();
    assert.typeOf(app.serveContent, 'function');
  });

  it('should serve index.cson + index.html for "/" route', (done) => {
    const app = createApp();
    const server = app.start();

    request(app)
      .get('/')
      .expect(200, /<h1>Expressful - Homepage<\/h1>/,
        (err) => server.close() && done(err));
  });

  it('should serve about.json + about.html for "/about" route', (done) => {
    const app = createApp();
    const server = app.start();

    request(app)
      .get('/about')
      .expect(200, /<h1>Expressful - About<\/h1>/,
        (err) => server.close() && done(err));
  });

  it('should serve /blog/2016__07__10__my-first-title.cson + blog-post.html for "/blog/2016/07/10/my-first-title" route', (done) => {
    const app = createApp();
    const server = app.start();

    request(app)
      .get('/blog/2016/07/10/my-first-title')
      .expect(200, /<h1>Expressful - My first title<\/h1>/,
        (err) => server.close() && done(err));
  });

});

function createApp () {
  const app = expressful({
    viewsDirectory: VIEWS_DIRECTORY,
    printRoutes: false
  });

  app.serveContent({
    contentDirectory: CONTENT_DIRECTORY
  });

  return app;
}
