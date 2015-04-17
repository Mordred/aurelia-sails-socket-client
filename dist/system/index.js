System.register(['./sails-socket-client', './transformers'], function (_export) {
  return {
    setters: [function (_sailsSocketClient) {
      _export('SailsSocketClient', _sailsSocketClient.SailsSocketClient);
    }, function (_transformers) {
      for (var _key in _transformers) {
        _export(_key, _transformers[_key]);
      }
    }],
    execute: function () {
      'use strict';
    }
  };
});