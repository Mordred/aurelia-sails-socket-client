System.register(['core-js', './headers', './request-builder', './socket-request-message'], function (_export) {
  var core, Headers, RequestBuilder, SocketRequestMessage, createSocketRequestMessageProcessor, _classCallCheck, _createClass, SailsSocketClient;

  function trackRequestStart(client, processor) {
    client.pendingRequests.push(processor);
    client.isRequesting = true;
  }

  function trackRequestEnd(client, processor) {
    var index = client.pendingRequests.indexOf(processor);

    client.pendingRequests.splice(index, 1);
    client.isRequesting = client.pendingRequests.length > 0;

    if (!client.isRequesting) {
      var evt = new window.CustomEvent('aurelia-sails-socket-client-requests-drained', { bubbles: true, cancelable: true });
      setTimeout(function () {
        return document.dispatchEvent(evt);
      }, 1);
    }
  }

  return {
    setters: [function (_coreJs) {
      core = _coreJs['default'];
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

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      SailsSocketClient = (function () {
        function SailsSocketClient(socket) {
          _classCallCheck(this, SailsSocketClient);

          this.socket = socket;

          this.requestTransformers = [];

          this.interceptors = [];

          this.pendingRequests = [];
          this.isRequesting = false;
        }

        _createClass(SailsSocketClient, [{
          key: 'setSocket',
          value: function setSocket(socket) {
            this.socket = socket;
            return this;
          }
        }, {
          key: 'addInterceptor',
          value: function addInterceptor(interceptor) {
            this.interceptors.unshift(interceptor);
            return this;
          }
        }, {
          key: 'configure',
          value: function configure(fn) {
            var builder = new RequestBuilder(this);
            fn(builder);
            this.requestTransformers = builder.transformers;
            return this;
          }
        }, {
          key: 'createRequest',
          value: function createRequest(uri) {
            var builder = new RequestBuilder(this);

            if (uri) {
              builder.withUri(uri);
            }

            return builder;
          }
        }, {
          key: 'send',
          value: function send(message, transformers) {
            var _this = this;

            var processor,
                promise,
                i,
                ii,
                transformPromises = [];

            processor = createSocketRequestMessageProcessor();
            trackRequestStart(this, processor);

            transformers = transformers || this.requestTransformers;

            for (i = 0, ii = transformers.length; i < ii; ++i) {
              transformPromises.push(transformers[i](this, processor, message));
            }

            var processRequest = function processRequest(message) {
              return processor.process(_this, message).then(function (response) {
                trackRequestEnd(_this, processor);
                return response;
              })['catch'](function (response) {
                trackRequestEnd(_this, processor);
                throw response;
              });
            };

            var chain = [processRequest, undefined];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = this.interceptors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var interceptor = _step.value;

                if (interceptor.request || interceptor.requestError) {
                  chain.unshift(interceptor.requestError ? interceptor.requestError.bind(interceptor) : undefined);
                  chain.unshift(interceptor.request ? interceptor.request.bind(interceptor) : undefined);
                }

                if (interceptor.response || interceptor.responseError) {
                  chain.push(interceptor.response ? interceptor.response.bind(interceptor) : undefined);
                  chain.push(interceptor.responseError ? interceptor.responseError.bind(interceptor) : undefined);
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator['return']) {
                  _iterator['return']();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            promise = Promise.all(transformPromises).then(function () {
              return message;
            });

            while (chain.length) {
              var thenFn = chain.shift();
              var rejectFn = chain.shift();
              promise = promise.then(thenFn, rejectFn);
            }

            promise.abort = promise.cancel = function () {
              processor.abort();
            };

            return promise;
          }
        }, {
          key: 'delete',
          value: function _delete(uri) {
            return this.createRequest(uri).asDelete().send();
          }
        }, {
          key: 'get',
          value: function get(uri) {
            return this.createRequest(uri).asGet().send();
          }
        }, {
          key: 'head',
          value: function head(uri) {
            return this.createRequest(uri).asHead().send();
          }
        }, {
          key: 'options',
          value: function options(uri) {
            return this.createRequest(uri).asOptions().send();
          }
        }, {
          key: 'put',
          value: function put(uri, content) {
            return this.createRequest(uri).asPut().withContent(content).send();
          }
        }, {
          key: 'patch',
          value: function patch(uri, content) {
            return this.createRequest(uri).asPatch().withContent(content).send();
          }
        }, {
          key: 'post',
          value: function post(uri, content) {
            return this.createRequest(uri).asPost().withContent(content).send();
          }
        }]);

        return SailsSocketClient;
      })();

      _export('SailsSocketClient', SailsSocketClient);
    }
  };
});