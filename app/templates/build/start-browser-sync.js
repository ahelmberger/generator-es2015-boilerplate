'use strict';

var browserSync = require('browser-sync');

module.exports = function (baseDir, middleware) {
  return browserSync({
    files: [baseDir + '/**'],
    server: { baseDir: baseDir, middleware: middleware },
    startPath: '/',
    browser: 'default'
  });
};
