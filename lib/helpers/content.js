'use strict';
/**
 * Expressful content
 */
const CSON = require('cson');
const fs = require('fs');

const MIXIN_IDENTIFIER = '__';

const defaultMixins = {
  /**
   * Extends an object
   *
   * @param {object} parent
   * @param {string} key -- is always '__extend'
   * @example global: __extend: 'global.cson' => global: brandName: 'Expressful'
   */
  extend: function extend (parent, key) {
    Object.assign(parent, parseFile(parent[key]));
    delete parent[key];
  }
};

/**
 * Transform an object with mixins as side effects
 *
 * @example property: __mixin: * => property: mixin(property, *)
 * @param {object} obj
 * @param {?object} mixins -- object with mixin functions
 * @return {object} obj -- return for convenience, not a new object!
 */
function transform (obj, mixins) {
  mixins = mixins || {};

  Object.keys(obj).forEach((key) => {
    if (key.indexOf(MIXIN_IDENTIFIER) === 0) {
      const mixinName = key.substring(2);

      if (mixins.hasOwnProperty(mixinName)) {
        mixins[mixinName](obj, key, transform, mixins);
      } else if (defaultMixins.hasOwnProperty(mixinName)) {
        defaultMixins[mixinName](obj, key, transform, mixins);
      } else {
        if ('development' === (process.env.NODE_ENV || 'development')) {
          console.log(`(transform) warning: unknown mixin '${key}' found when parsing object`);
        }
      }
    } else if (toString.call(obj[key]) === '[object Object]') {
      obj[key] = transform(obj[key], mixins);
    }
  });

  return obj;
}


/**
 * Parses a json file and transforms it with mixins
 *
 * @example parseFile('./content/homepage.cson'); => { ... }
 * @param {string|array} filePath -- should have json or cson extension
 * @return {object} transform parsed file
 */
function parseFile (filePath, mixins) {
  if (typeof filePath === 'string') {
    switch (extension(filePath)) {
      case 'json': return transform(parseJSONFile(filePath), mixins);
      case 'cson': return transform(CSON.parseCSONFile(filePath), mixins);
      default: throw new Error(`file extension not supported for ${filePath}`)
    }
  } else if (Array.isArray(filePath)) {
    return Object.assign.apply(null,
      filePath.map((x) => parseFile(x)));
  } else {
    throw new Error(`filePath '${filePath}' should be a string or array.`);
  }
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
