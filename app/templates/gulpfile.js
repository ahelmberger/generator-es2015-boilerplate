'use strict';

var path               = require('path');
var gulp               = require('gulp');
var jspm               = require('jspm');
var rimraf             = require('rimraf');
var runSequence        = require('run-sequence');
var historyApiFallback = require('connect-history-api-fallback');
var tools              = require('require-dir')('build', { camelcase: true });
var $                  = require('gulp-load-plugins')();

var supportedBrowsers  = ['last 3 versions', 'last 3 BlackBerry versions', 'last 3 Android versions'];
var exitOnError        = true;

gulp.task('clean', function (done) {
  rimraf.sync('.tmp', { maxBusyTries: 5 });
  rimraf.sync('dist', { maxBusyTries: 5 });
  done();
});

gulp.task('lint', function () {
  return gulp.src(['*.js', 'build/**/*.js', 'app/**/*.js', '!app/jspm_packages/**', '!app/config.js'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(exitOnError, $.eslint.failAfterError()));
});

gulp.task('styles', function (done) {
  tools.compileLess({
    from: 'app/main.less',
    to: '.tmp/main.css',
    base: 'app',
    embedErrors: true,
    csswring: { removeAllComments: true },
    autoprefixer: { browsers: supportedBrowsers }
  }).then(done, done);
});

gulp.task('build:styles', function (done) {
  tools.compileLess({
    from: 'app/main.less',
    to: 'dist/main.css',
    base: 'app',
    sourceRoot: '/sources/',
    csswring: { removeAllComments: true },
    autoprefixer: { browsers: supportedBrowsers }
  }).then(done, done);
});

gulp.task('build:scripts', function (done) {
  var bundleOptions = { minify: true, mangle: false, sourceMaps: true, lowResSourceMaps: false };
  jspm.setPackagePath('.');
  jspm.bundleSFX('main', 'dist/main.js', bundleOptions).then(function () {
    tools.sanitizeSourceMap('dist/main.js.map', 'app', '/sources/');
  }).then(done, done);
});

gulp.task('build:html', function () {
  return gulp.src('app/index.html')
    .pipe($.htmlReplace({ css: '/main.css', js: '/main.js' }))
    .pipe($.minifyHtml({ empty: true, spare: true, quotes: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', function (done) {
  runSequence('clean', 'lint', 'test', ['build:styles', 'build:scripts', 'build:html'], done);
});

gulp.task('serve', ['styles'], function () {
  tools.startBrowserSync(['.tmp', 'app'], [historyApiFallback]);
});

gulp.task('serve:dist', function () {
  tools.startBrowserSync('dist', [historyApiFallback]);
});

gulp.task('test', function (done) {
  var options = { configFile: path.resolve('karma.conf.js'), singleRun: true, browsers: ['PhantomJS'] };
  tools.runKarma(options, exitOnError, done);
});

gulp.task('test:debug', function (done) {
  var options = { configFile: path.resolve('karma.conf.js'), singleRun: false, browsers: ['Chrome'] };
  tools.runKarma(options, exitOnError, done);
});

gulp.task('lint-and-test', function (done) {
  runSequence('lint', 'test', done);
});

gulp.task('watch', ['serve'], function () {
  exitOnError = false;
  gulp.watch(['*.js', 'build/*.js'], ['lint']);
  gulp.watch(['app/**/*.js'], ['lint-and-test']);
  gulp.watch(['app/**/*.less'], ['styles']);
});

gulp.task('default', ['watch']);
