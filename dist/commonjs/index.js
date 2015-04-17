'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _SailsSocketClient = require('./sails-socket-client');

Object.defineProperty(exports, 'SailsSocketClient', {
  enumerable: true,
  get: function get() {
    return _SailsSocketClient.SailsSocketClient;
  }
});

var _transformers = require('./transformers');

_defaults(exports, _interopRequireWildcard(_transformers));