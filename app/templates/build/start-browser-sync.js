'use strict';

var browserSync = require('browser-sync');

module.exports = function (baseDir, middleware) {
  return browserSync({
    files: (typeof baseDir === 'string') ? (baseDir + '/**') : baseDir.map(function (dir) { return dir + '/**'; }),
    server: { baseDir: baseDir, middleware: middleware },
    startPath: '/',
    browser: 'default'
  });
};
