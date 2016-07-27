const express = require('express');
const fs = require('fs');
const path = require('path');
const parseFile = require('expressful-content').parseFile;
const fileExists = require('./file-exists');

const FAKE_SLASH_IDENTIFIER = '__';

/**
 * @param {string} path -- content directory
 * @param {string} viewsDirectory
 */
function contentRouter (contentDirectory, viewsDirectory) {
  const router = express.Router();

  // Used to identify in the routes table
  router.title = 'Content Routes';

  walkSync(contentDirectory, (filePath) => {
    const relativePath = substractPath(filePath, contentDirectory);
    const routePath = substractExtension(relativePath);

    // filenames that start with and underscore '_' are private
    if (path.basename(routePath).indexOf('_') === 0) return;

    // Load the content into memory and get the view
    const content = parseFile(contentDirectory, relativePath);
    const view = content.$layout || routePath.substr(1);


    if ( ! fileExists(path.join(viewsDirectory, `${view}.html`))) {
      if ('development' === process.env.NODE_ENV) {
        console.log('');
        console.log('+------------------------------------------------------------');
        console.log(`| VIEW NOT FOUND: './views/${view}.html'`);
        console.log(`|   content file: './content${relativePath}'`);
        console.log('+------------------------------------------------------------');
        console.log(`| Prepend underscore to ignore: '_${path.basename(relativePath)}'`);
        console.log('| OR ');
        console.log(`| Create a view: './views${routePath}.html'`);
        console.log('+------------------------------------------------------------');
        console.log('');
      }
      return;
    }

    // Add the route to the router
    router.get(convertFakeSlashes(routePath),
      (req, res) => res.render(view, content));
  });

  return router;
}

/**
 * Used to split up the filePath
 * /blog/2016__10__06__some-title => /blog/2016/10/06/some-title
 */
function convertFakeSlashes (filePath) {
  return filePath.split(FAKE_SLASH_IDENTIFIER).join('/');
}

function substractPath (full, partial) {
  return full.substring(full.indexOf(partial) + partial.length);
}

function substractExtension (filePath) {
  return filePath.substr(0, filePath.indexOf(path.extname(filePath)));
}

function walkSync (currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach((name) => {
    const filePath = path.join(currentDirPath, name);
    const basename = path.basename(filePath);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      const extension = path.extname(filePath);

      if (extension === '.cson' || extension === '.json') {
        callback(filePath);
      }
    } else if (stat.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
}

module.exports = contentRouter;
