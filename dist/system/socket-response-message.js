System.register(['./headers'], function (_export) {
  var Headers, _classCallCheck, _createClass, SocketResponseMessage;

  return {
    setters: [function (_headers) {
      Headers = _headers.Headers;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      SocketResponseMessage = (function () {
        function SocketResponseMessage(requestMessage, body, JWR) {
          _classCallCheck(this, SocketResponseMessage);

          this.requestMessage = requestMessage;
          this.statusCode = JWR.statusCode;
          this.body = body;

          this.isSuccess = this.statusCode >= 200 && this.statusCode < 400;
          this.headers = new Headers(JWR.headers);
        }

        _createClass(SocketResponseMessage, [{
          key: 'content',
          get: function () {
            return this.body;
          }
        }]);

        return SocketResponseMessage;
      })();

      _export('SocketResponseMessage', SocketResponseMessage);
    }
  };
});