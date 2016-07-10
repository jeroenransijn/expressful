'use strict';
const CSON = require('cson');
const fileExists = require('./helpers/file-exists');

/**
 * Helper that renders views in /views/pages/ if the file exists
 * @param {object} express app
 */
function servePages (app) {

  app.get(['/', '/:page'], (req, res, next) => {
    const page = req.params.page || 'homepage';
    if (pageExists(page)) {
      res.render(`pages/${page}.html`, content(page));
    } else {
      next();
    }
  });

}

function pageExists (page) {
  return fileExists(`./views/pages/${page}.html`);
}

/**
 * Returns the content for a page
 *
 * @param {string} pageName -- the name of the page without extension
 * @return {object} content for the page
 */
function content (pageName) {
  const date = new Date();

  /**
   * merges
   */
  return Object.assign({
      year: date.getFullYear(),
      date: date.getDate(),
      day: date.getDay()
    },
    parseFile('global'),
    parseFile(pageName));
}

function parseFile (fileName) {
  let content = {};
  try {
    content = CSON.parseCSONFile(`./content/${fileName}.cson`);
  } finally {
    return content;
  }
}

module.exports = servePages;
