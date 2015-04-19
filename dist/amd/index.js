define(['exports', './sails-socket-client', 'sails.io.js', './transformers'], function (exports, _sailsSocketClient, _sailsIoJs, _transformers) {
  'use strict';

  var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

  var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.install = install;
  Object.defineProperty(exports, 'SailsSocketClient', {
    enumerable: true,
    get: function get() {
      return _sailsSocketClient.SailsSocketClient;
    }
  });

  _defaults(exports, _interopRequireWildcard(_transformers));

  var io = window.io;
  io.sails.autoConnect = false;

  function install(aurelia, configCallback) {

    var sails = new _sailsSocketClient.SailsSocketClient();

    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(sails, io);
    }

    sails.setSocket(io.sails.connect());

    aurelia.container.registerInstance(_sailsSocketClient.SailsSocketClient, sails);
  }
});