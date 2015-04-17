define(['exports', 'core-js'], function (exports, _coreJs) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.CSRFTransformerFactory = CSRFTransformerFactory;

  var _core = _interopRequire(_coreJs);

  function CSRFTransformerFactory(uri) {
    return function CSRFTransformer(client, processor, message) {
      if (message.method === 'get' || message.uri === uri) {
        return;
      }

      var setCsrfToken = function setCsrfToken(message, token) {
        return message.headers.add('X-Csrf-Token', token);
      };

      if (client.CSRFToken) {
        setCsrfToken(message, client.CSRFToken);
      } else {
        return new Promise(function (resolve, reject) {
          var request = client.createRequest(uri).asGet();

          request.send().then(function (response) {
            client.CSRFToken = response.content._csrf;
            setCsrfToken(message, client.CSRFToken);
            resolve();
          })['catch'](reject);
        });
      }
    };
  }
});