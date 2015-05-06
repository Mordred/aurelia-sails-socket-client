'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

exports.__esModule = true;
exports.configure = configure;

var _SailsSocketClient = require('./sails-socket-client');

require('sails.io.js');

exports.SailsSocketClient = _SailsSocketClient.SailsSocketClient;

var _interceptors = require('./interceptors');

_defaults(exports, _interopRequireWildcard(_interceptors));

var io = window.io;
io.sails.autoConnect = false;

function configure(aurelia, configCallback) {

  var sails = new _SailsSocketClient.SailsSocketClient();

  if (configCallback !== undefined && typeof configCallback === 'function') {
    configCallback(sails, io);
  }

  sails.setSocket(io.sails.connect());

  aurelia.container.registerInstance(_SailsSocketClient.SailsSocketClient, sails);
}