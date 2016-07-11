'use strict';
/**
 * Expressful content
 */
const CSON = require('cson');
const path = require('path');
const fs = require('fs');

const MIXIN_IDENTIFIER = '__';

const defaultMixins = {
  /**
   * Extends an object by parsing the file
   *
   * @param {object} parent
   * @param {string} key -- is always '__extend'
   * @param {function} transfrom
   * @param {object} mixins
   * @param {string} dirname
   * @example global: __extend: 'global.cson' => global: brandName: 'Expressful'
   */
  extend: function extend (parent, key, transform, mixins, dirname) {
    const contents = parseFile(dirname, parent[key], mixins);

    Object.keys(contents)
      .forEach((newKey) => {
        if ( ! parent.hasOwnProperty(newKey)) {
          parent[newKey] = contents[newKey];
        }
      });

    delete parent[key];
  },


  /**
   * Lists the content of all the file in the directory as an array
   * parent[key] should be an object: { directory: './blog', ?as: 'posts' }
   * - directory -- the relative directory seen from the file
   * - as -- optionally pass property name it should put back, defaults to 'list'
   *
   * @example __list: directory: './blog', as: 'posts' => posts: [{ ... }, { ... }]
   */
  list: function list (parent, key, transform, mixins, dirname) {
    const propertyName = parent[key].as;
    const listDirname = path.join(dirname, parent[key].directory);

    delete parent[key];

    parent[propertyName || 'list'] = fs.readdirSync(listDirname)
      .map((fileName) => {
        return parseFile(listDirname, fileName, mixins)
      });
  }
};

/**
 * Transform an object with mixins as side effects
 *
 * @example property: __mixin: * => property: mixin(property, *)
 * @param {object} obj
 * @param {?object} mixins -- object with mixin functions
 * @param {?string} dirname --
 * @return {object} obj -- return for convenience, not a new object!
 */
function transform (obj, mixins, dirname) {
  mixins = mixins || {};

  Object.keys(obj).forEach((key) => {
    if (key.indexOf(MIXIN_IDENTIFIER) === 0) {
      const mixinName = key.substring(2);

      if (mixins.hasOwnProperty(mixinName)) {
        mixins[mixinName](obj, key, transform, mixins, dirname);
      } else if (defaultMixins.hasOwnProperty(mixinName)) {
        defaultMixins[mixinName](obj, key, transform, mixins, dirname);
      } else {
        if ('development' === (process.env.NODE_ENV || 'development')) {
          console.log(`(transform) warning: unknown mixin '${key}' found when parsing object`);
        }
      }
    } else if (toString.call(obj[key]) === '[object Object]') {
      obj[key] = transform(obj[key], mixins, dirname);
    }
  });

  return obj;
}


/**
 * Parses a json file and transforms it with mixins
 *
 * @example parseFile('./content/homepage.cson'); => { ... }
 * @param {string} dirname -- this makes extends work
 * @param {string|array} filePath -- should have json or cson extension
 * @return {object} transform parsed file
 */
function parseFile (dirname, filePath, mixins) {
  if (typeof filePath === 'string') {
    const completePath = path.join(dirname, filePath);

    // make dirname relative if filePath contains slashes
    dirname = relativeDirname(dirname, filePath);

    switch (extension(filePath)) {
      case 'json': return transform(parseJSONFile(completePath), mixins, dirname);
      case 'cson': return transform(CSON.parseCSONFile(completePath), mixins, dirname);
      default: throw new Error(`file extension not supported for ${filePath}`)
    }
  } else if (Array.isArray(filePath)) {
    return Object.assign.apply(null,
      filePath.map((x) => parseFile(dirname, x, mixins)));
  } else {
    throw new Error(`filePath '${filePath}' should be a string or array.`);
  }
}

/**
 * Returns the complete dirname
 *
 * @private
 * @example relativeDirname('/content/', /blog/post.cson); => '/content/blog/'
 * @param {string} dirname
 * @param {string} filePath
 */
function relativeDirname (dirname, filePath) {
  const arr = filePath.split('/');
  return path.join(dirname, arr.slice(0, arr.length - 1).join('/'));
}

/**
 * @private
 * @param {string} str
 * @return {string} the extension of a filePath
 */
function extension (str) {
  const arr = str.split('.');
  return arr[arr.length - 1];
}

/**
 * @private
 * @param {string} filePath
 * @return {object} parsed json file
 */
function parseJSONFile (filePath) {
  return JSON.parse(fs.readFileSync(filePath, { extension: 'utf-8' }));
}

module.exports = {
  parseFile: parseFile,
  transform: transform
};
