'use strict';
const chai = require('chai');
const express = require('express');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const path = require('path');
const contentRouter = require('../lib/helpers/content-router');

const CONTENT_DIRECTORY = path.join(__dirname, '/content');
const VIEWS_DIRECTORY = path.join(__dirname, '/views');

describe('contentRouter', () => {
  it('should be a function', () => {
    assert.typeOf(contentRouter, 'function');
  });

  it('should return a router with a title', () => {
    assert.equal(contentRouter(CONTENT_DIRECTORY, VIEWS_DIRECTORY).title, 'Content Routes');
  });
});
