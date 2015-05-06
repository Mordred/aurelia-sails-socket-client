System.register(['core-js'], function (_export) {
  var core, _classCallCheck, CSRFInterceptor;

  return {
    setters: [function (_coreJs) {
      core = _coreJs['default'];
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      CSRFInterceptor = (function () {
        function CSRFInterceptor(url, client, token) {
          _classCallCheck(this, CSRFInterceptor);

          this.url = url;
          this.client = client;
          this.token = token;
        }

        CSRFInterceptor.prototype.request = function request(message) {
          var _this = this;

          if (message.method === 'get' || message.url === this.url) {
            return message;
          }

          if (this.token) {
            this.setCsrfTokenHeader(message);
            return message;
          } else {
            return new Promise(function (resolve, reject) {
              _this.client.get(_this.url).then(function (response) {
                _this.token = response.content._csrf;
                _this.setCsrfTokenHeader(message);
                resolve(message);
              })['catch'](reject);
            });
          }
        };

        CSRFInterceptor.prototype.setCsrfTokenHeader = function setCsrfTokenHeader(message) {
          message.headers.add('X-Csrf-Token', this.token);
          return message;
        };

        return CSRFInterceptor;
      })();

      _export('CSRFInterceptor', CSRFInterceptor);
    }
  };
});