const express = require('express');
const fs = require('fs');
const path = require('path');

const FAKE_SLASH_IDENTIFIER = '__';

function contentRouter (path, createHandler) {
  const router = express.Router();

  walkSync(path, (filePath) => {
    const relativePath = substractPath(filePath, path);
    const routePath = convertFakeSlashes(
        substractExtension(relativePath));

    router.get(routePath, createHandler({
      relativeFilePath: relativePath,
      filePath: filePath,
      path: routePath
    }));
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
