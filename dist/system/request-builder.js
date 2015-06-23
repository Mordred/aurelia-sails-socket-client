System.register(['aurelia-path', './socket-request-message'], function (_export) {
  var join, SocketRequestMessage, _classCallCheck, RequestBuilder;

  return {
    setters: [function (_aureliaPath) {
      join = _aureliaPath.join;
    }, function (_socketRequestMessage) {
      SocketRequestMessage = _socketRequestMessage.SocketRequestMessage;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      RequestBuilder = (function () {
        function RequestBuilder(client) {
          _classCallCheck(this, RequestBuilder);

          this.client = client;
          this.transformers = client.requestTransformers.slice(0);
        }

        RequestBuilder.addHelper = function addHelper(name, fn) {
          RequestBuilder.prototype[name] = function () {
            this.transformers.push(fn.apply(this, arguments));
            return this;
          };
        };

        RequestBuilder.prototype.send = function send() {
          var message = new SocketRequestMessage();
          return this.client.send(message, this.transformers);
        };

        return RequestBuilder;
      })();

      _export('RequestBuilder', RequestBuilder);

      RequestBuilder.addHelper('asDelete', function () {
        return function (client, processor, message) {
          message.method = 'delete';
        };
      });

      RequestBuilder.addHelper('asGet', function () {
        return function (client, processor, message) {
          message.method = 'get';
        };
      });

      RequestBuilder.addHelper('asHead', function () {
        return function (client, processor, message) {
          message.method = 'head';
        };
      });

      RequestBuilder.addHelper('asOptions', function () {
        return function (client, processor, message) {
          message.method = 'options';
        };
      });

      RequestBuilder.addHelper('asPatch', function () {
        return function (client, processor, message) {
          message.method = 'patch';
        };
      });

      RequestBuilder.addHelper('asPost', function () {
        return function (client, processor, message) {
          message.method = 'post';
        };
      });

      RequestBuilder.addHelper('asPut', function () {
        return function (client, processor, message) {
          message.method = 'put';
        };
      });

      RequestBuilder.addHelper('withUrl', function (url) {
        return function (client, processor, message) {
          message.url = url;
        };
      });

      RequestBuilder.addHelper('withContent', function (content) {
        return function (client, processor, message) {
          message.content = content;
        };
      });

      RequestBuilder.addHelper('withBaseUrl', function (baseUrl) {
        return function (client, processor, message) {
          message.baseUrl = baseUrl;
        };
      });

      RequestBuilder.addHelper('withParams', function (params) {
        return function (client, processor, message) {
          message.params = params;
        };
      });

      RequestBuilder.addHelper('withHeader', function (key, value) {
        return function (client, processor, message) {
          message.headers.add(key, value);
        };
      });

      RequestBuilder.addHelper('withCredentials', function (value) {
        return function (client, processor, message) {
          message.withCredentials = value;
        };
      });

      RequestBuilder.addHelper('withInterceptor', function (interceptor) {
        return function (client, processor, message) {
          message.interceptors = message.interceptors || [];
          message.interceptors.unshift(interceptor);
        };
      });
    }
  };
});