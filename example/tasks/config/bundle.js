/**
 * Bundle files.
 *
 * ---------------------------------------------------------------
 *
 */
var bundler = require('aurelia-bundler');

module.exports = function (grunt) {

  var config = {
    force: true,
    configPath: './.tmp/public/config.js',
    baseURL: './.tmp/public/',
    bundles: {
      'min/production.min': {
        includes: [
          'aurelia-framework',
          "aurelia-animator-css",
          "aurelia-bootstrapper",
          "aurelia-loader-default",
          "aurelia-templating-binding",
          "aurelia-templating-resources",
          "aurelia-templating-router",
          "aurelia-dependency-injection",
          "aurelia-framework",
          "aurelia-router",
          "aurelia-history-browser",
          "aurelia-sails-socket-client",
          "css",
          "sails.io.js",
          "todomvc-common",
          "js/*.js",
          "js/*.html!text"
        ],
        minify: true,
        inject: false
      }
    }
  };

  grunt.registerTask('bundle', 'Bundle JS files to production.min.js', function () {
    var done = this.async();
    grunt.file.mkdir('./.tmp/public/min/');
    bundler.bundle(config).then(function() { done(); }, done);
  });

};
