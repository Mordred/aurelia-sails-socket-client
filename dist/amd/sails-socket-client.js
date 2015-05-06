define(['exports', 'core-js', './headers', './request-builder', './socket-request-message'], function (exports, _coreJs, _headers, _requestBuilder, _socketRequestMessage) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

  exports.__esModule = true;

  var _core = _interopRequire(_coreJs);

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

  var SailsSocketClient = (function () {
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
      var builder = new _requestBuilder.RequestBuilder(this);
      fn(builder);
      this.requestTransformers = builder.transformers;
      return this;
    };

    SailsSocketClient.prototype.createRequest = function createRequest(url) {
      var builder = new _requestBuilder.RequestBuilder(this);

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

      processor = _socketRequestMessage.createSocketRequestMessageProcessor();
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

      for (var _iterator = this.interceptors, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var interceptor = _ref;

        if (interceptor.request || interceptor.requestError) {
          chain.unshift(interceptor.requestError ? interceptor.requestError.bind(interceptor) : undefined);
          chain.unshift(interceptor.request ? interceptor.request.bind(interceptor) : undefined);
        }

        if (interceptor.response || interceptor.responseError) {
          chain.push(interceptor.response ? interceptor.response.bind(interceptor) : undefined);
          chain.push(interceptor.responseError ? interceptor.responseError.bind(interceptor) : undefined);
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
    };

    SailsSocketClient.prototype['delete'] = function _delete(url) {
      return this.createRequest(url).asDelete().send();
    };

    SailsSocketClient.prototype.get = function get(url) {
      return this.createRequest(url).asGet().send();
    };

    SailsSocketClient.prototype.head = function head(url) {
      return this.createRequest(url).asHead().send();
    };

    SailsSocketClient.prototype.options = function options(url) {
      return this.createRequest(url).asOptions().send();
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

    return SailsSocketClient;
  })();

  exports.SailsSocketClient = SailsSocketClient;
});