'use strict';

var karma = require('karma');

module.exports = function (options, throwOnFailure, done) {
  karma.server.start(options, function (failedTests) {
    if (failedTests && throwOnFailure) {
      throw new Error('Terminating process due to failing tests.');
    }
    done();
  });
};
