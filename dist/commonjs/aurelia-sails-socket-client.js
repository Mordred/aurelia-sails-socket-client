'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggerInterceptor = exports.CSRFInterceptor = exports.SailsSocketClient = exports.RequestBuilder = exports.SocketRequestMessage = exports.RequestMessageProcessor = exports.SocketResponseMessage = exports.Headers = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.configure = configure;
exports.createSocketRequestMessageProcessor = createSocketRequestMessageProcessor;

var _aureliaLogging = require('aurelia-logging');

var LogManager = _interopRequireWildcard(_aureliaLogging);

var _aureliaPath = require('aurelia-path');

var _aureliaPal = require('aurelia-pal');

var _sailsIo = require('sails.io.js');

var _sailsIo2 = _interopRequireDefault(_sailsIo);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function configure(config, configCallback) {
  var io = (0, _sailsIo2.default)(_socket2.default);
  io.sails.autoConnect = false;
  var sails = new SailsSocketClient();

  if (configCallback !== undefined && typeof configCallback === 'function') {
    configCallback(sails, io);
  }

  sails.setSocket(io.sails.connect());

  config.instance(SailsSocketClient, sails);
}

var Headers = exports.Headers = function () {
  function Headers() {
    var headers = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Headers);

    this.headers = headers;
  }

  Headers.prototype.add = function add(key, value) {
    this.headers[key] = value;
  };

  Headers.prototype.get = function get(key) {
    return this.headers[key];
  };

  Headers.prototype.clear = function clear() {
    this.headers = {};
  };

  return Headers;
}();

var SocketResponseMessage = exports.SocketResponseMessage = function () {
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
    get: function get() {
      return this.body;
    }
  }]);

  return SocketResponseMessage;
}();

var RequestMessageProcessor = exports.RequestMessageProcessor = function () {
  function RequestMessageProcessor(transformers) {
    _classCallCheck(this, RequestMessageProcessor);

    this.transformers = transformers;
  }

  RequestMessageProcessor.prototype.abort = function abort() {
    throw new Error('Cannot abort socket request');
  };

  RequestMessageProcessor.prototype.process = function process(client, requestMessage) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      var transformers = _this.transformers;
      var promises = [];
      var i = void 0;
      var ii = void 0;

      for (i = 0, ii = transformers.length; i < ii; ++i) {
        promises.push(transformers[i](client, _this, requestMessage));
      }

      return Promise.all(promises).then(function () {
        return resolve(requestMessage);
      }).catch(reject);
    }).then(function (message) {
      var processRequest = function processRequest(currentMessage) {
        return new Promise(function (resolve, reject) {
          client.socket.request(currentMessage.options, function (data, jwr) {
            var response = new SocketResponseMessage(currentMessage, data, jwr);
            if (response.isSuccess) {
              resolve(response);
            } else {
              reject(response);
            }
          });
        });
      };

      var chain = [[processRequest, undefined]];

      var interceptors = message.interceptors || [];
      interceptors.forEach(function (interceptor) {
        if (interceptor.request || interceptor.requestError) {
          chain.unshift([interceptor.request ? interceptor.request.bind(interceptor) : undefined, interceptor.requestError ? interceptor.requestError.bind(interceptor) : undefined]);
        }

        if (interceptor.response || interceptor.responseError) {
          chain.push([interceptor.response ? interceptor.response.bind(interceptor) : undefined, interceptor.responseError ? interceptor.responseError.bind(interceptor) : undefined]);
        }
      });

      var interceptorsPromise = Promise.resolve(message);

      while (chain.length) {
        var _interceptorsPromise;

        interceptorsPromise = (_interceptorsPromise = interceptorsPromise).then.apply(_interceptorsPromise, chain.shift());
      }

      return interceptorsPromise;
    });
  };

  return RequestMessageProcessor;
}();

function buildFullUrl(message) {
  var url = void 0;
  var qs = void 0;

  if (message.url && message.url[0] === '/') {
    url = message.url;
  } else {
    url = (0, _aureliaPath.join)(message.baseUrl, message.url);
  }

  if (message.params) {
    qs = (0, _aureliaPath.buildQueryString)(message.params);
    url = qs ? url + '?' + qs : url;
  }

  return url;
}

var SocketRequestMessage = exports.SocketRequestMessage = function () {
  function SocketRequestMessage(method, url, content, headers) {
    _classCallCheck(this, SocketRequestMessage);

    this.method = method;
    this.url = url;
    this.content = content;
    this.headers = headers || new Headers();
  }

  _createClass(SocketRequestMessage, [{
    key: 'options',
    get: function get() {
      return {
        method: this.method,
        url: buildFullUrl(this),
        params: this.content,
        headers: this.headers.headers
      };
    }
  }]);

  return SocketRequestMessage;
}();

function createSocketRequestMessageProcessor() {
  return new RequestMessageProcessor([]);
}

var RequestBuilder = exports.RequestBuilder = function () {
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
}();

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

function trackRequestStart(client, processor) {
  client.pendingRequests.push(processor);
  client.isRequesting = true;
}

function trackRequestEnd(client, processor) {
  var index = client.pendingRequests.indexOf(processor);

  client.pendingRequests.splice(index, 1);
  client.isRequesting = client.pendingRequests.length > 0;

  if (!client.isRequesting) {
    (function () {
      var evt = _aureliaPal.DOM.createCustomEvent('aurelia-sails-socket-client-requests-drained', { bubbles: true, cancelable: true });
      setTimeout(function () {
        return _aureliaPal.DOM.dispatchEvent(evt);
      }, 1);
    })();
  }
}

var SailsSocketClient = exports.SailsSocketClient = function () {
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

  SailsSocketClient.prototype.send = function send(requestMessage, transformers) {
    var _this2 = this;

    var processor = void 0;
    var promise = void 0;
    var i = void 0;
    var ii = void 0;
    var transformPromises = [];

    processor = createSocketRequestMessageProcessor();
    trackRequestStart(this, processor);

    transformers = transformers || this.requestTransformers;

    promise = Promise.resolve(requestMessage).then(function (message) {
      for (i = 0, ii = transformers.length; i < ii; ++i) {
        transformPromises.push(transformers[i](_this2, processor, message));
      }

      return processor.process(_this2, message).then(function (response) {
        trackRequestEnd(_this2, processor);
        return response;
      }).catch(function (response) {
        trackRequestEnd(_this2, processor);
        throw response;
      });
    });

    promise.abort = promise.cancel = function () {
      processor.abort();
    };

    return promise;
  };

  SailsSocketClient.prototype.delete = function _delete(url, content) {
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
}();

var logger = LogManager.getLogger('sails');

var CSRFInterceptor = exports.CSRFInterceptor = function () {
  function CSRFInterceptor(url, client, token) {
    _classCallCheck(this, CSRFInterceptor);

    this.url = url;
    this.client = client;
    this.token = token;
  }

  CSRFInterceptor.prototype.request = function request(message) {
    var _this3 = this;

    if (message.method === 'get' || message.url === this.url) {
      return message;
    }

    if (this.token) {
      this.setCsrfTokenHeader(message);
      return message;
    }

    return new Promise(function (resolve, reject) {
      var promise = void 0;
      if (_this3._fetching) {
        promise = _this3._fetching;
      } else {
        promise = _this3._fetching = _this3.client.get(_this3.url);
      }
      promise.then(function (response) {
        _this3.token = response.content._csrf;
        _this3.setCsrfTokenHeader(message);
        resolve(message);
      }).catch(reject);
    });
  };

  CSRFInterceptor.prototype.setCsrfTokenHeader = function setCsrfTokenHeader(message) {
    message.headers.add('X-Csrf-Token', this.token);
    return message;
  };

  return CSRFInterceptor;
}();

var LoggerInterceptor = function () {
  function LoggerInterceptor() {
    _classCallCheck(this, LoggerInterceptor);
  }

  LoggerInterceptor.prototype.request = function request(message) {
    logger.debug('Sending message to sails', message);
    return message;
  };

  LoggerInterceptor.prototype.response = function response(_response) {
    logger.debug('Receiving response from sails', _response);
    return _response;
  };

  LoggerInterceptor.prototype.responseError = function responseError(response) {
    logger.error('There was an error during sails request', response);
    throw response;
  };

  return LoggerInterceptor;
}();

exports.LoggerInterceptor = LoggerInterceptor;