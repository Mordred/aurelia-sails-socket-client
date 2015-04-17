System.register(['aurelia-path', './headers', './request-message-processor'], function (_export) {
  var join, buildQueryString, Headers, RequestMessageProcessor, _classCallCheck, _createClass, SocketRequestMessage;

  _export('createSocketRequestMessageProcessor', createSocketRequestMessageProcessor);

  function buildFullUri(message) {

    var uri, qs;

    if (message.uri && message.uri[0] == '/') {
      uri = message.uri;
    } else {
      uri = join(message.baseUri, message.uri);
    }

    if (message.params) {
      qs = buildQueryString(message.params);
      uri = qs ? '' + uri + '?' + qs : uri;
    }

    return uri;
  }

  function createSocketRequestMessageProcessor() {
    return new RequestMessageProcessor([]);
  }

  return {
    setters: [function (_aureliaPath) {
      join = _aureliaPath.join;
      buildQueryString = _aureliaPath.buildQueryString;
    }, function (_headers) {
      Headers = _headers.Headers;
    }, function (_requestMessageProcessor) {
      RequestMessageProcessor = _requestMessageProcessor.RequestMessageProcessor;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      SocketRequestMessage = (function () {
        function SocketRequestMessage(method, uri, content, headers) {
          _classCallCheck(this, SocketRequestMessage);

          this.method = method;
          this.uri = uri;
          this.content = content;
          this.headers = headers || new Headers();
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

      _export('SocketRequestMessage', SocketRequestMessage);
    }
  };
});