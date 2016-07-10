'use strict';
const errorHandler = require('errorhandler')

/**
 * Start the app
 */
function start () {

  // error handling middleware should be loaded after the loading the routes
  if ('development' === this.get('env')) {
    this.use(errorHandler());
  }

  this.listen(this.get('port'), () => {
    console.log('Expressful server listening on port ' + this.get('port'));
  });

}

module.exports = start;
