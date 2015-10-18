define(['exports', 'aurelia-pal', './sails-socket-client', 'sails.io.js', './interceptors'], function (exports, _aureliaPal, _sailsSocketClient, _sailsIoJs, _interceptors) {
  'use strict';

  var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

  var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

  exports.__esModule = true;
  exports.configure = configure;
  exports.SailsSocketClient = _sailsSocketClient.SailsSocketClient;

  _defaults(exports, _interopRequireWildcard(_interceptors));

  var io = _aureliaPal.PLATFORM.global.io;
  io.sails.autoConnect = false;

  function configure(config, configCallback) {

    var sails = new _sailsSocketClient.SailsSocketClient();

    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(sails, io);
    }

    sails.setSocket(io.sails.connect());

    config.instance(_sailsSocketClient.SailsSocketClient, sails);
  }
});