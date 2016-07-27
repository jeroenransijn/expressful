'use strict';
const path = require('path');
const express = require('express');
const setup = require('./lib/setup');
const start = require('./lib/start');
const serveContent = require('./lib/serve-content');

const ROOT = path.dirname(require.main.filename);
const CONTENT_DIRECTORY = path.join(ROOT, 'content');

/**
 * Returns expressful app
 *
 * @param {object} options -- extends the default settings
 * @return {object} expressful app object
 */
function expressful (options) {

  const settings = Object.assign({
    publicDirectory: path.join(ROOT, 'public'), // 'public' is the default static folder
    viewsDirectory: path.join(ROOT, 'views'),
    faviconPath: path.join(ROOT, 'public/favicon.ico'), // path to favicon
    muteFavicon: true, // make it easy to get started without a favicon
    useNunjucks: true // nunjucks is the default templating engine
  }, options || {});

  const app = express();

  setup(app, settings);

  app.serveContent = (options) => {
    options = options || {};

    serveContent(app, options.contentDirectory || CONTENT_DIRECTORY);

    return app;
  }

  app.start = () => {
    start(app);
    return app;
  }

  return app;
}

module.exports = expressful;
