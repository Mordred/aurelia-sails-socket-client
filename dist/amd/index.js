define(['exports', './sails-socket-client', './transformers'], function (exports, _sailsSocketClient, _transformers) {
  'use strict';

  var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

  var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  Object.defineProperty(exports, 'SailsSocketClient', {
    enumerable: true,
    get: function get() {
      return _sailsSocketClient.SailsSocketClient;
    }
  });

  _defaults(exports, _interopRequireWildcard(_transformers));
});