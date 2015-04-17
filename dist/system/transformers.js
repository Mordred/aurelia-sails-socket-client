System.register(['core-js'], function (_export) {
  var core;

  _export('CSRFTransformerFactory', CSRFTransformerFactory);

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

  return {
    setters: [function (_coreJs) {
      core = _coreJs['default'];
    }],
    execute: function () {
      'use strict';
    }
  };
});