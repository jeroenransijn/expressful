'use strict';
const errorHandler = require('errorhandler');
const printRoutes = require('./helpers/print-routes');

/**
 * Start the app
 * basically a proxy for app.listen
 *
 * @param {object} express app
 * @return {object} server -- mainly used for testing
 */
function start (app, settings) {

  // error handling middleware should be loaded after the loading the routes
  if ('development' === app.get('env')) {
    app.use(errorHandler());
    if (settings.printRoutes) printRoutes(app);

    // Setup a proxy to webpack
    const proxy = require('http-proxy').createProxyServer();

    app.all('/dist/*', (req, res) => {
      proxy.web(req, res, {
        target: 'http://localhost:8080'
      });
    });

    // It is important to catch any errors from the proxy or the
    // server will crash. An example of this is connecting to the
    // server when webpack is bundling
    proxy.on('error', (e) => {
      console.log('Could not connect to development proxy.');
    });
  }

  return app.listen(app.get('port'), () => {
    console.log('Expressful server listening on port ' + app.get('port') + '. Environment: ' + process.env.NODE_ENV + '.');
  });

}

module.exports = start;
