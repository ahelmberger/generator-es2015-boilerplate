'use strict';

var path       = require('path');
var fse        = require('fs-extra');
var bundleLess = require('bundle-less');

module.exports = function (options) {
  var inputFile = path.resolve(options.from);
  var outputFile = path.resolve(options.to);
  var less = fse.readFileSync(inputFile, 'utf-8');
  return bundleLess(less, options).then(function (result) {
    fse.ensureDirSync(path.dirname(outputFile));
    fse.writeFileSync(outputFile + '.map', result.map, 'utf-8');
    fse.writeFileSync(outputFile, result.css, 'utf-8');
  });
};
