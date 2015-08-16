System.register(['./sails-socket-client', 'sails.io.js', './interceptors'], function (_export) {
  var SailsSocketClient, io;

  _export('configure', configure);

  function configure(config, configCallback) {

    var sails = new SailsSocketClient();

    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(sails, io);
    }

    sails.setSocket(io.sails.connect());

    config.instance(SailsSocketClient, sails);
  }

  return {
    setters: [function (_sailsSocketClient) {
      SailsSocketClient = _sailsSocketClient.SailsSocketClient;

      _export('SailsSocketClient', _sailsSocketClient.SailsSocketClient);
    }, function (_sailsIoJs) {}, function (_interceptors) {
      for (var _key in _interceptors) {
        _export(_key, _interceptors[_key]);
      }
    }],
    execute: function () {
      'use strict';

      io = window.io;

      io.sails.autoConnect = false;
    }
  };
});