'use strict';
const express = require('express');
const setup = require('./lib/setup');
const start = require('./lib/start');
const servePages = require('./lib/serve-pages');

/**
 * Returns expressful app
 *
 * @param {object} options -- extends the default settings
 * @return {object} expressful app object
 */
function expressful (options) {

  const settings = Object.assign({
    publicFolderName: 'public', // 'public' is the default static folder
    faviconPath: 'public/favicon.ico', // path to favicon
    muteFavicon: true, // make it easy to get started without a favicon
    useNunjucks: true // nunjucks is the default templating engine
  }, options || {});

  const app = express();

  setup(app, settings);

  app.servePages = () => {
    servePages(app);
    return app;
  }

  app.start = () => {
    start(app);
    return app;
  }

  return app;
}

module.exports = expressful;
