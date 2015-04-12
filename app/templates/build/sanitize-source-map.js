'use strict';

var path = require('path');
var fse  = require('fs-extra');

module.exports = function (file, base, sourceRoot) {
  var sourceMap = JSON.parse(fse.readFileSync(file, 'utf-8'));
  if (sourceMap.version !== 3) {
    throw new Error('Only v3 source maps are supported.');
  }
  sourceMap.sourcesContent = sourceMap.sources.map(function (source) {
    return fse.readFileSync(path.resolve(path.dirname(file), source), 'utf-8');
  });
  sourceMap.sources = sourceMap.sources.map(function (source) {
    return path.relative(path.resolve(base), path.resolve(path.dirname(file), source)).replace(/\\/g, '/');
  });
  sourceMap.sourceRoot = sourceRoot;
  delete sourceMap.file;
  fse.writeFileSync(file, JSON.stringify(sourceMap));
};
