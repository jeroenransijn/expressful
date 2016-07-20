'use strict';
const errorHandler = require('errorhandler');
const printRoutes = require('./helpers/print-routes');

/**
 * Start the app
 *
 * @param {object} express app
 */
function start (app) {

  // error handling middleware should be loaded after the loading the routes
  if ('development' === app.get('env')) {
    app.use(errorHandler());
    printRoutes(app);
  }

  app.listen(app.get('port'), () => {
    console.log('Expressful server listening on port ' + app.get('port') + '. environment: ' + process.env.NODE_ENV);
  });

}

module.exports = start;
