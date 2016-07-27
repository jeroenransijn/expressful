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
  }

  return app.listen(app.get('port'), () => {
    console.log('Expressful server listening on port ' + app.get('port') + '. Environment: ' + process.env.NODE_ENV + '.');
  });

}

module.exports = start;
