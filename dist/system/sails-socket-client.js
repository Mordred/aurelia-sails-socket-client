System.register(['core-js', 'aurelia-pal', './headers', './request-builder', './socket-request-message'], function (_export) {
  var core, DOM, Headers, RequestBuilder, SocketRequestMessage, createSocketRequestMessageProcessor, _classCallCheck, SailsSocketClient;

  function trackRequestStart(client, processor) {
    client.pendingRequests.push(processor);
    client.isRequesting = true;
  }

  function trackRequestEnd(client, processor) {
    var index = client.pendingRequests.indexOf(processor);

    client.pendingRequests.splice(index, 1);
    client.isRequesting = client.pendingRequests.length > 0;

    if (!client.isRequesting) {
      var evt = DOM.createCustomEvent('aurelia-sails-socket-client-requests-drained', { bubbles: true, cancelable: true });
      setTimeout(function () {
        return DOM.dispatchEvent(evt);
      }, 1);
    }
  }

  return {
    setters: [function (_coreJs) {
      core = _coreJs['default'];
    }, function (_aureliaPal) {
      DOM = _aureliaPal.DOM;
    }, function (_headers) {
      Headers = _headers.Headers;
    }, function (_requestBuilder) {
      RequestBuilder = _requestBuilder.RequestBuilder;
    }, function (_socketRequestMessage) {
      SocketRequestMessage = _socketRequestMessage.SocketRequestMessage;
      createSocketRequestMessageProcessor = _socketRequestMessage.createSocketRequestMessageProcessor;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      SailsSocketClient = (function () {
        function SailsSocketClient(socket) {
          _classCallCheck(this, SailsSocketClient);

          this.socket = socket;

          this.requestTransformers = [];

          this.interceptors = [];

          this.pendingRequests = [];
          this.isRequesting = false;
        }

        SailsSocketClient.prototype.setSocket = function setSocket(socket) {
          this.socket = socket;
          return this;
        };

        SailsSocketClient.prototype.addInterceptor = function addInterceptor(interceptor) {
          this.interceptors.unshift(interceptor);
          return this;
        };

        SailsSocketClient.prototype.configure = function configure(fn) {
          var builder = new RequestBuilder(this);
          fn(builder);
          this.requestTransformers = builder.transformers;
          return this;
        };

        SailsSocketClient.prototype.createRequest = function createRequest(url) {
          var builder = new RequestBuilder(this);

          if (url) {
            builder.withUrl(url);
          }

          return builder;
        };

        SailsSocketClient.prototype.send = function send(message, transformers) {
          var _this = this;

          var processor,
              promise,
              i,
              ii,
              transformPromises = [];

          processor = createSocketRequestMessageProcessor();
          trackRequestStart(this, processor);

          transformers = transformers || this.requestTransformers;

          promise = Promise.resolve(message).then(function (message) {
            for (i = 0, ii = transformers.length; i < ii; ++i) {
              transformPromises.push(transformers[i](_this, processor, message));
            }

            return processor.process(_this, message).then(function (response) {
              trackRequestEnd(_this, processor);
              return response;
            })['catch'](function (response) {
              trackRequestEnd(_this, processor);
              throw response;
            });
          });

          promise.abort = promise.cancel = function () {
            processor.abort();
          };

          return promise;
        };

        SailsSocketClient.prototype['delete'] = function _delete(url, content) {
          return this.createRequest(url).asDelete().withContent(content).send();
        };

        SailsSocketClient.prototype.get = function get(url, content) {
          return this.createRequest(url).asGet().withContent(content).send();
        };

        SailsSocketClient.prototype.head = function head(url, content) {
          return this.createRequest(url).asHead().withContent(content).send();
        };

        SailsSocketClient.prototype.options = function options(url, content) {
          return this.createRequest(url).asOptions().withContent(content).send();
        };

        SailsSocketClient.prototype.put = function put(url, content) {
          return this.createRequest(url).asPut().withContent(content).send();
        };

        SailsSocketClient.prototype.patch = function patch(url, content) {
          return this.createRequest(url).asPatch().withContent(content).send();
        };

        SailsSocketClient.prototype.post = function post(url, content) {
          return this.createRequest(url).asPost().withContent(content).send();
        };

        SailsSocketClient.prototype.on = function on(eventName, fn) {
          this.socket.on(eventName, fn);
          return this;
        };

        SailsSocketClient.prototype.off = function off(eventName, fn) {
          this.socket.off(eventName, fn);
          return this;
        };

        return SailsSocketClient;
      })();

      _export('SailsSocketClient', SailsSocketClient);
    }
  };
});