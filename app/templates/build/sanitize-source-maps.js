'use strict';

var fs   = require('fs');
var path = require('path');
var glob = require('glob');

function sanitizeSourceMap(sourceMapPath, baseDir, sourceRoot) {
  var sourceMap = JSON.parse(fs.readFileSync(sourceMapPath, 'utf-8'));
  if (sourceMap.version !== 3) {
    throw new Error('Only v3 source maps are supported.');
  }
  sourceMap.sourcesContent = sourceMap.sources.map(function (source) {
    return fs.readFileSync(path.resolve(path.dirname(sourceMapPath), source), 'utf-8');
  });
  sourceMap.sources = sourceMap.sources.map(function (source) {
    return path.relative(path.resolve(baseDir), path.resolve(path.dirname(sourceMapPath), source)).replace(/\\/g, '/');
  });
  sourceMap.sourceRoot = sourceRoot || '/';
  sourceMap.file = path.basename(sourceMapPath).replace(/\.map$/, '');
  fs.writeFileSync(sourceMapPath, JSON.stringify(sourceMap));
}

module.exports = function (sourceMaps, baseDir, sourceRoot, done) {
  glob(sourceMaps, function (error, files) {
    if (error) {
      done(error);
    } else {
      try {
        files.forEach(function (sourceMapPath) {
          sanitizeSourceMap(sourceMapPath, baseDir, sourceRoot);
        });
        done();
      } catch (err) {
        done(err);
      }
    }
  });
};
