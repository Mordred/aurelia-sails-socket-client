System.register(['./sails-socket-client', 'sails.io.js', './transformers'], function (_export) {
  var SailsSocketClient, io;

  _export('install', install);

  function install(aurelia, configCallback) {

    var sails = new SailsSocketClient();

    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(sails, io);
    }

    sails.setSocket(io.sails.connect());

    aurelia.container.registerInstance(SailsSocketClient, sails);
  }

  return {
    setters: [function (_sailsSocketClient) {
      SailsSocketClient = _sailsSocketClient.SailsSocketClient;

      _export('SailsSocketClient', _sailsSocketClient.SailsSocketClient);
    }, function (_sailsIoJs) {}, function (_transformers) {
      for (var _key in _transformers) {
        _export(_key, _transformers[_key]);
      }
    }],
    execute: function () {
      'use strict';

      io = window.io;

      io.sails.autoConnect = false;
    }
  };
});