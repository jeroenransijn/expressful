'use strict';
const path = require('path');
const parseFile = require('expressful-content').parseFile;
const fileExists = require('./helpers/file-exists');
const contentRouter = require('./helpers/content-router');

/**
 * Helper that renders views in /views/pages/ if the file exists
 * @param {object} express app
 */
function serveContent (app, contentDir) {

  app.use('/', contentRouter(contentDir, (route) => {
    return (req, res, next) => {
      const content = parseFile(contentDir, route.relativeFilePath);
      const view = content.$layout || route.path.substr(1);
      if ( ! fileExists(path.join(app.get('views'), `${view}.html`))) return next();
      res.render(view, content);
    }
  }));

}

module.exports = serveContent;
