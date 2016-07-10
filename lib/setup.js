'use strict';
const path = require('path');

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const nunjucks = require('nunjucks');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const markdown = require('./helpers/markdown');
const fileExists = require('./helpers/file-exists');

/**
 * Setup a sane express installation
 * @param {object} express app
 * @param {object} settings
 */
function setup (app, settings) {
	app.set('port', process.env.PORT || 3000);
	app.set('views', 'views');

	if (app.get('env') === 'development') {
		app.use(logger('dev'));
	}

	if (settings.muteFavicon) {
		app.get('/favicon.ico', (req, res) => res.send(200));
	} else {
		app.use(favicon(settings.faviconPath));
	}

	// use body parser so we can get info from POST and/or URL parameters
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	app.use(cookieParser());
	app.use(session({
		resave: true,
		saveUninitialized: true,
		secret: 'uwotm8'
	}));

	// Set up a directory for static resources
	app.use(express.static(path.join(`./${settings.publicFolderName}`)));

	if (settings.useNunjucks) {
		const env = nunjucks.configure('views', {
			autoescape: true,
			express: app
		});

		// Give nunjucks some superpowers with Remarkable and highlight.js
		env.addFilter('markdown', (x) => markdown.render(x));
		// Set Nunjucks as rendering engine for pages with .html suffix
		app.engine('html', nunjucks.render);
	}
}

module.exports = setup;