'use strict';

var path               = require('path');
var gulp               = require('gulp');
var jspm               = require('jspm');
var rimraf             = require('rimraf');
var runSequence        = require('run-sequence');
var browserSync        = require('browser-sync');
var CleanCssPlugin     = require('less-plugin-clean-css');
var AutoPrefixPlugin   = require('less-plugin-autoprefix');
var cssToLessFallback  = require('connect-css-to-less-fallback');
var historyApiFallback = require('connect-history-api-fallback');
var tools              = require('require-dir')('build', { camelcase: true });
var $                  = require('gulp-load-plugins')();

var supportedBrowsers  = ['last 3 versions', 'last 3 BlackBerry versions', 'last 3 Android versions'];
var autoPrefix         = new AutoPrefixPlugin({ browsers: supportedBrowsers });
var cleanCss           = new CleanCssPlugin({ advanced: true });
var exitOnError        = true;

gulp.task('clean', function (done) {
  rimraf('dist', { maxBusyTries: 5 }, done);
});

gulp.task('lint', function () {
  return gulp.src(['*.js', 'build/**/*.js', 'app/**/*.js', '!app/jspm_packages/**', '!app/config.js'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(exitOnError, $.eslint.failAfterError()));
});

gulp.task('build:styles', function () {
  return gulp.src('app/main.less')
    .pipe($.sourcemaps.init())
    .pipe($.less({ plugins: [cleanCss, autoPrefix] }))
    .pipe($.sourcemaps.write('.', { includeContent: false, sourceRoot: '.' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build:scripts', function (done) {
  var bundleOptions = { minify: true, mangle: true, sourceMaps: true, lowResSourceMaps: false };
  jspm.setPackagePath('.');
  jspm.bundleSFX('main', 'dist/main.js', bundleOptions).then(done, done);
});

gulp.task('build:html', function () {
  return gulp.src('app/index.html')
    .pipe($.htmlReplace({ css: '/main.css', js: '/main.js' }))
    .pipe($.minifyHtml({ empty: true, spare: true, quotes: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', function (done) {
  runSequence('clean', 'lint', 'test', ['build:styles', 'build:scripts', 'build:html'], 'sanitize-sourcemaps', done);
});

gulp.task('sanitize-sourcemaps', function (done) {
  tools.sanitizeSourceMaps('dist/*.map', 'app', '/sources/', done);
});

gulp.task('serve', function () {
  var options = { root: 'app', plugins: [cleanCss, autoPrefix], sourceMap: true };
  tools.startBrowserSync('app', [cssToLessFallback(options), historyApiFallback]);
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

gulp.task('reload-styles', function () {
  browserSync.reload('main.css');
});

gulp.task('watch', ['serve'], function () {
  exitOnError = false;
  gulp.watch(['*.js', 'build/*.js'], ['lint']);
  gulp.watch(['app/**/*.js'], ['lint-and-test']);
  gulp.watch(['app/**/*.less'], ['reload-styles']);
});

gulp.task('default', ['watch']);
