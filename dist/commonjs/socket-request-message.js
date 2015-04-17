'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createSocketRequestMessageProcessor = createSocketRequestMessageProcessor;

var _join$buildQueryString = require('aurelia-path');

var _Headers = require('./headers');

var _RequestMessageProcessor = require('./request-message-processor');

function buildFullUri(message) {

  var uri, qs;

  if (message.uri && message.uri[0] == '/') {
    uri = message.uri;
  } else {
    uri = _join$buildQueryString.join(message.baseUri, message.uri);
  }

  if (message.params) {
    qs = _join$buildQueryString.buildQueryString(message.params);
    uri = qs ? '' + uri + '?' + qs : uri;
  }

  return uri;
}

var SocketRequestMessage = (function () {
  function SocketRequestMessage(method, uri, content, headers) {
    _classCallCheck(this, SocketRequestMessage);

    this.method = method;
    this.uri = uri;
    this.content = content;
    this.headers = headers || new _Headers.Headers();
  }

  _createClass(SocketRequestMessage, [{
    key: 'options',
    get: function () {
      return {
        method: this.method,
        url: buildFullUri(this),
        params: this.content,
        headers: this.headers.headers
      };
    }
  }]);

  return SocketRequestMessage;
})();

exports.SocketRequestMessage = SocketRequestMessage;

function createSocketRequestMessageProcessor() {
  return new _RequestMessageProcessor.RequestMessageProcessor([]);
}