'use strict';
const path = require('path');
const contentRouter = require('./helpers/content-router');

/**
 * Helper that renders views in /views/pages/ if the file exists
 * @param {object} express app
 */
function serveContent (app, contentDir) {

  app.use('/', contentRouter(contentDir, app.get('views')));

}

module.exports = serveContent;
