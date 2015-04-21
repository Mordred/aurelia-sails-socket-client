'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _core = require('core-js');

var _core2 = _interopRequireWildcard(_core);

var CSRFInterceptor = (function () {
  function CSRFInterceptor(uri, client, token) {
    _classCallCheck(this, CSRFInterceptor);

    this.uri = uri;
    this.client = client;
    this.token = token;
  }

  _createClass(CSRFInterceptor, [{
    key: 'request',
    value: function request(message) {
      var _this = this;

      if (message.method === 'get' || message.uri === this.uri) {
        return message;
      }

      if (this.token) {
        this.setCsrfTokenHeader(message);
        return message;
      } else {
        return new Promise(function (resolve, reject) {
          _this.client.get(_this.uri).then(function (response) {
            _this.token = response.content._csrf;
            _this.setCsrfTokenHeader(message);
            resolve(message);
          })['catch'](reject);
        });
      }
    }
  }, {
    key: 'setCsrfTokenHeader',
    value: function setCsrfTokenHeader(message) {
      message.headers.add('X-Csrf-Token', this.token);
      return message;
    }
  }]);

  return CSRFInterceptor;
})();

exports.CSRFInterceptor = CSRFInterceptor;