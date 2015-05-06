define(['exports', './headers'], function (exports, _headers) {
  'use strict';

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.__esModule = true;

  var SocketResponseMessage = (function () {
    function SocketResponseMessage(requestMessage, body, JWR) {
      _classCallCheck(this, SocketResponseMessage);

      this.requestMessage = requestMessage;
      this.statusCode = JWR.statusCode;
      this.body = body;

      this.isSuccess = this.statusCode >= 200 && this.statusCode < 400;
      this.headers = new _headers.Headers(JWR.headers);
    }

    _createClass(SocketResponseMessage, [{
      key: 'content',
      get: function () {
        return this.body;
      }
    }]);

    return SocketResponseMessage;
  })();

  exports.SocketResponseMessage = SocketResponseMessage;
});