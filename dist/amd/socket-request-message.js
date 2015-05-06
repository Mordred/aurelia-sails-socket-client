define(['exports', 'aurelia-path', './headers', './request-message-processor'], function (exports, _aureliaPath, _headers, _requestMessageProcessor) {
  'use strict';

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.__esModule = true;
  exports.createSocketRequestMessageProcessor = createSocketRequestMessageProcessor;

  function buildFullUrl(message) {

    var url, qs;

    if (message.url && message.url[0] == '/') {
      url = message.url;
    } else {
      url = _aureliaPath.join(message.baseUrl, message.url);
    }

    if (message.params) {
      qs = _aureliaPath.buildQueryString(message.params);
      url = qs ? '' + url + '?' + qs : url;
    }

    return url;
  }

  var SocketRequestMessage = (function () {
    function SocketRequestMessage(method, url, content, headers) {
      _classCallCheck(this, SocketRequestMessage);

      this.method = method;
      this.url = url;
      this.content = content;
      this.headers = headers || new _headers.Headers();
    }

    _createClass(SocketRequestMessage, [{
      key: 'options',
      get: function () {
        return {
          method: this.method,
          url: buildFullUrl(this),
          params: this.content,
          headers: this.headers.headers
        };
      }
    }]);

    return SocketRequestMessage;
  })();

  exports.SocketRequestMessage = SocketRequestMessage;

  function createSocketRequestMessageProcessor() {
    return new _requestMessageProcessor.RequestMessageProcessor([]);
  }
});