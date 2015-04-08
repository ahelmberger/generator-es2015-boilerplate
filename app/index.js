'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();
    this.log(yosay(
      'Welcome to the awesome ' + chalk.red('ECMAScript 2015 Boilerplate') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'How would you like to call this package?',
      default: _.kebabCase(path.basename(this.destinationRoot()))
    }, {
      type: 'input',
      name: 'version',
      message: 'Which version number should this package have?',
      default: '0.0.0'
    }, {
      type: 'input',
      name: 'description',
      message: 'Which description should this package have?'
    }, {
      type: 'input',
      name: 'author',
      message: 'What is the package author\'s name?'
    }, {
      type: 'input',
      name: 'license',
      message: 'Which license should this package have?',
      default: 'MIT'
    }, {
      type: 'input',
      name: 'repositoryUrl',
      message: 'What is the package\'s repository url?'
    }, {
      type: 'confirm',
      name: 'private',
      message: 'Should this package be marked as private?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this.props
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copy(
        this.templatePath('gitattributes'),
        this.destinationPath('.gitattributes')
      );
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('eslintrc'),
        this.destinationPath('.eslintrc')
      );
      this.fs.copy(
        this.templatePath('gulpfile.js'),
        this.destinationPath('gulpfile.js')
      );
      this.fs.copy(
        this.templatePath('karma.conf.js'),
        this.destinationPath('karma.conf.js')
      );
      this.fs.copy(
        this.templatePath('app/**'),
        this.destinationPath('app')
      );
      this.fs.copy(
        this.templatePath('build/**'),
        this.destinationPath('build')
      );
    }
  },

  install: function () {
    var npmInstall = chalk.yellow('npm install');
    var jspmInstall = chalk.yellow('jspm install');
    var message = '\n\nI\'m all done.';
    if (this.skipInstall) {
      message += ' Just run ' + npmInstall + ' & ' + jspmInstall + ' to install the required dependencies.';
    } else {
      message += ' Running ' + npmInstall + ' & ' + jspmInstall + ' for you to install the required dependencies.';
      message += '\nIf this fails, try running the command yourself.';
    }
    message += '\n\n';
    this.log(message);
    this.runInstall('npm');
    this.runInstall('node_modules/.bin/jspm');
  }
});
