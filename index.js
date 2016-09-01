'use strict';
const path = require('path');
const express = require('express');
const setup = require('./lib/setup');
const start = require('./lib/start');
const serveContent = require('./lib/serve-content');

/**
 * Returns expressful app
 *
 * @param {object} options -- extends the default settings
 * @return {object} expressful app object
 */
function expressful (options) {

  // There is no reliable way to get the root, allow for setting it manually
  const ROOT = (options || {}).root || path.dirname(require.main.filename);
  const CONTENT_DIRECTORY = path.join(ROOT, 'content');

  const settings = Object.assign({
    publicDirectory: path.join(ROOT, 'public'), // 'public' is the default static folder
    viewsDirectory: path.join(ROOT, 'views'),
    faviconPath: path.join(ROOT, 'public/favicon.ico'), // path to favicon
    muteFavicon: true, // make it easy to get started without a favicon
    useNunjucks: true, // nunjucks is the default templating engine
    printRoutes: true, // wether or not to print routes, only in development
    useDevProxy: true // wether to use a proxy for webpack, only in development
  }, options || {});

  const app = express();

  setup(app, settings);

  app.serveContent = (options) => {
    options = options || {};

    serveContent(app, options.contentDirectory || CONTENT_DIRECTORY);

    return app;
  }

  // Returns server
  app.start = () => start(app, settings);

  return app;
}

module.exports = expressful;
