import * as LogManager from 'aurelia-logging';
import {join,buildQueryString} from 'aurelia-path';
import {DOM,PLATFORM} from 'aurelia-pal';

const logger = LogManager.getLogger('sails');

export class CSRFInterceptor {

  /**
   * @constructor
   * @param url URL of the sails CSRF getter
   * @param {SailsSocketClient} client Client for getting CSRF from server
   * @param token Optional token - use when you have prefetched token, e.g. rendered in HTML
   */
  constructor(url, client, token) {
    this.url = url;
    this.client = client;
    this.token = token;
  }

  /**
   * Request message interceptor
   *
   * @param message
   * @returns {SocketRequestMessage}
   */
  request(message) {
    if (message.method === 'get' || message.url === this.url) {
      return message;
    }

    if (this.token) {
      this.setCsrfTokenHeader(message);
      return message;
    }

    return new Promise((resolve, reject) => {
      let promise;
      if (this._fetching) {
        promise = this._fetching;
      } else {
        promise = this._fetching = this.client.get(this.url);
      }
      promise.then(response => {
        this.token = response.content._csrf;
        this.setCsrfTokenHeader(message);
        resolve(message);
      }).catch(reject);
    });
  }

  setCsrfTokenHeader(message) {
    message.headers.add('X-Csrf-Token', this.token);
    return message;
  }

}

export class LoggerInterceptor {

  request(message) {
    logger.debug('Sending message to sails', message);
    return message;
  }

  response(response) {
    logger.debug('Receiving response from sails', response);
    return response;
  }

  responseError(response) {
    logger.error('There was an error during sails request', response);
    throw response;
  }

}

export class Headers {

  constructor(headers = {}) {
    this.headers = headers;
  }

  add(key, value) {
    this.headers[key] = value;
  }

  get(key) {
    return this.headers[key];
  }

  clear() {
    this.headers = {};
  }

}

export class SocketResponseMessage {

  // JWR ==> "JSON WebSocket Response" from sails.io.js
  constructor(requestMessage, body, JWR) {
    this.requestMessage = requestMessage;
    this.statusCode = JWR.statusCode;
    this.body = body;

    this.isSuccess = this.statusCode >= 200 && this.statusCode < 400;
    this.headers = new Headers(JWR.headers);
  }

  get content() {
    return this.body;
  }

}

export class RequestMessageProcessor {

  constructor(transformers) {
    this.transformers = transformers;
  }

  abort() {
    // TODO: Is this really impossible?
    throw new Error('Cannot abort socket request');
  }

  process(client, requestMessage) {
    return new Promise((resolve, reject) => {
      let transformers = this.transformers;
      let promises = [];
      let i;
      let ii;


      for (i = 0, ii = transformers.length; i < ii; ++i) {
        promises.push(transformers[i](client, this, requestMessage));
      }

      return Promise.all(promises).then(() => resolve(requestMessage)).catch(reject);
    }).then((message) => {
      let processRequest = (currentMessage) => {
        return new Promise((resolve, reject) => {
          client.socket.request(currentMessage.options, function(data, jwr) {
            let response = new SocketResponseMessage(currentMessage, data, jwr);
            if (response.isSuccess) {
              resolve(response);
            } else {
              reject(response);
            }
          });
        });
      };

      // [ onFullfilled, onReject ] pairs
      let chain = [[processRequest, undefined]];
      // Apply interceptors chain from the message.interceptors
      let interceptors = message.interceptors || [];
      interceptors.forEach(function(interceptor) {
        if (interceptor.request || interceptor.requestError) {
          chain.unshift([
            interceptor.request ? interceptor.request.bind(interceptor) : undefined,
            interceptor.requestError ? interceptor.requestError.bind(interceptor) : undefined
          ]);
        }

        if (interceptor.response || interceptor.responseError) {
          chain.push([
            interceptor.response ? interceptor.response.bind(interceptor) : undefined,
            interceptor.responseError ? interceptor.responseError.bind(interceptor) : undefined
          ]);
        }
      });

      let interceptorsPromise = Promise.resolve(message);

      while (chain.length) {
        interceptorsPromise = interceptorsPromise.then(...chain.shift());
      }

      return interceptorsPromise;
    });
  }

}

function buildFullUrl(message) {
  let url;
  let qs;

  // Message URL starts with / - as absolute URL
  if (message.url && message.url[0] === '/') {
    url = message.url;
  } else {
    url = join(message.baseUrl, message.url);
  }

  if (message.params) {
    qs = buildQueryString(message.params);
    url = qs ? `${url}?${qs}` : url;
  }

  return url;
}

export class SocketRequestMessage {

  constructor(method, url, content, headers) {
    this.method = method;
    this.url = url;
    this.content = content;
    this.headers = headers || new Headers();
  }

  get options() {
    return {
      method: this.method,
      url: buildFullUrl(this),
      params: this.content,
      headers: this.headers.headers
    };
  }

}

export function createSocketRequestMessageProcessor() {
  return new RequestMessageProcessor([]);
}

export class RequestBuilder {

  constructor(client) {
    this.client = client;
    this.transformers = client.requestTransformers.slice(0);
  }

  static addHelper(name, fn) {
    RequestBuilder.prototype[name] = function() {
      this.transformers.push(fn.apply(this, arguments));
      return this;
    };
  }

  send() {
    let message = new SocketRequestMessage();
    return this.client.send(message, this.transformers);
  }

}

RequestBuilder.addHelper('asDelete', function() {
  return function(client, processor, message) {
    message.method = 'delete';
  };
});

RequestBuilder.addHelper('asGet', function() {
  return function(client, processor, message) {
    message.method = 'get';
  };
});

RequestBuilder.addHelper('asHead', function() {
  return function(client, processor, message) {
    message.method = 'head';
  };
});

RequestBuilder.addHelper('asOptions', function() {
  return function(client, processor, message) {
    message.method = 'options';
  };
});

RequestBuilder.addHelper('asPatch', function() {
  return function(client, processor, message) {
    message.method = 'patch';
  };
});

RequestBuilder.addHelper('asPost', function() {
  return function(client, processor, message) {
    message.method = 'post';
  };
});

RequestBuilder.addHelper('asPut', function() {
  return function(client, processor, message) {
    message.method = 'put';
  };
});

RequestBuilder.addHelper('withUrl', function(url) {
  return function(client, processor, message) {
    message.url = url;
  };
});

RequestBuilder.addHelper('withContent', function(content) {
  return function(client, processor, message) {
    message.content = content;
  };
});

RequestBuilder.addHelper('withBaseUrl', function(baseUrl) {
  return function(client, processor, message) {
    message.baseUrl = baseUrl;
  };
});

RequestBuilder.addHelper('withParams', function(params) {
  return function(client, processor, message) {
    message.params = params;
  };
});

RequestBuilder.addHelper('withHeader', function(key, value) {
  return function(client, processor, message) {
    message.headers.add(key, value);
  };
});

RequestBuilder.addHelper('withCredentials', function(value) {
  return function(client, processor, message) {
    message.withCredentials = value;
  };
});

RequestBuilder.addHelper('withInterceptor', function(interceptor) {
  return function(client, processor, message) {
    // NOTE: Interceptors are stored in reverse order. Inner interceptors before outer interceptors.
    // This reversal is needed so that we can build up the interception chain around the
    // server request.
    message.interceptors = message.interceptors || [];
    message.interceptors.unshift(interceptor);
  };
});

/* jshint esnext:true */
function trackRequestStart(client, processor) {
  client.pendingRequests.push(processor);
  client.isRequesting = true;
}

function trackRequestEnd(client, processor) {
  let index = client.pendingRequests.indexOf(processor);

  client.pendingRequests.splice(index, 1);
  client.isRequesting = client.pendingRequests.length > 0;

  if (!client.isRequesting) {
    let evt = DOM.createCustomEvent('aurelia-sails-socket-client-requests-drained', {bubbles: true, cancelable: true});
    setTimeout(() => DOM.dispatchEvent(evt), 1);
  }
}

/**
 * The main sails socket client object.
 *
 * @class SailsClient
 * @constructor
 */
export class SailsSocketClient {

  /**
   * @constructor
   * @param {SailsSocket|null} socket A sails socket instance
   */
  constructor(socket) {
    this.socket = socket;

    // Allow to set transformers before request and after request transformers
    this.requestTransformers = [];

    this.interceptors = [];

    this.pendingRequests = [];
    this.isRequesting = false;
  }

  /**
   * Change socket instance
   *
   * @method setSocket
   * @param {SailsSocket} socket A sails socket instance
   * @chainable
   */
  setSocket(socket) {
    this.socket = socket;
    return this;
  }

  /**
   * Add new interceptor
   *
   * NOTE: Interceptors are stored in reverse order. Inner interceptors before outer interceptors.
   * This reversal is needed so that we can build up the interception chain around the
   * server request.
   *
   * @method addInterceptor
   * @param {Interceptor} interceptor A interceptor class
   * @chainable
   */
  addInterceptor(interceptor) {
    this.interceptors.unshift(interceptor);
    return this;
  }


  /**
   * Configure this SailsClient with default settings to be used by all requests.
   *
   * @method configure
   * @param {Function} fn A function that takes a RequestBuilder as an argument.
   * @chainable
   */
  configure(fn) {
    let builder = new RequestBuilder(this);
    fn(builder);
    this.requestTransformers = builder.transformers;
    return this;
  }

  /**
   * Returns a new RequestBuilder for this SailsClient instance that can be used to build and send socket requests.
   *
   * @method createRequest
   * @param url The target URL.
   * @type RequestBuilder
   */
  createRequest(url) {
    let builder = new RequestBuilder(this);

    if (url) {
      builder.withUrl(url);
    }

    return builder;
  }

  /**
   * Sends a message using the underlying networking stack.
   *
   * @method send
   * @param requestMessage A configured SocketRequestMessage.
   * @param {Array} transformers A collection of transformers to apply to the socket request.
   * @return {Promise} A cancellable promise object.
   */
  send(requestMessage, transformers) {
    let processor;
    let promise;
    let i;
    let ii;
    let transformPromises = [];

    processor = createSocketRequestMessageProcessor();
    trackRequestStart(this, processor);

    transformers = transformers || this.requestTransformers;

    promise = Promise.resolve(requestMessage)
      .then((message) => {
        // First apply transformers passed to the client.send()
        for (i = 0, ii = transformers.length; i < ii; ++i) {
          transformPromises.push(transformers[i](this, processor, message));
        }

        return processor.process(this, message).then(response => {
          trackRequestEnd(this, processor);
          return response;
        }).catch(response => {
          trackRequestEnd(this, processor);
          throw response;
        });
      });

    promise.abort = promise.cancel = function() {
      processor.abort();
    };

    return promise;
  }

  /**
   * Sends an DELETE request.
   *
   * @method delete
   * @param {String} url The target URL.
   * @param {object|undefined} content Params for the URL.
   * @return {Promise} A cancellable promise object.
   */
  delete(url, content) {
    return this.createRequest(url).asDelete().withContent(content).send();
  }

  /**
   * Sends an GET request.
   *
   * @method get
   * @param {String} url The target URL.
   * @param {Object|undefined} content The request payload.
   * @return {Promise} A cancellable promise object.
   */
  get(url, content) {
    return this.createRequest(url).asGet().withContent(content).send();
  }

  /**
   * Sends an HEAD request.
   *
   * @method head
   * @param {String} url The target URL.
   * @param {Object|undefined} content The request payload.
   * @return {Promise} A cancellable promise object.
   */
  head(url, content) {
    return this.createRequest(url).asHead().withContent(content).send();
  }

  /**
   * Sends an OPTIONS request.
   *
   * @method options
   * @param {String} url The target URL.
   * @param {Object|undefined} content The request payload.
   * @return {Promise} A cancellable promise object.
   */
  options(url, content) {
    return this.createRequest(url).asOptions().withContent(content).send();
  }

  /**
   * Sends an PUT request.
   *
   * @method put
   * @param {String} url The target URL.
   * @param {Object|undefined} content The request payload.
   * @return {Promise} A cancellable promise object.
   */
  put(url, content) {
    return this.createRequest(url).asPut().withContent(content).send();
  }

  /**
   * Sends an PATCH request.
   *
   * @method patch
   * @param {String} url The target URL.
   * @param {Object|undefined} content The request payload.
   * @return {Promise} A cancellable promise object.
   */
  patch(url, content) {
    return this.createRequest(url).asPatch().withContent(content).send();
  }

  /**
   * Sends an POST request.
   *
   * @method post
   * @param {String} url The target URL.
   * @param {Object|undefined} content The request payload.
   * @return {Promise} A cancellable promise object.
   */
  post(url, content) {
    return this.createRequest(url).asPost().withContent(content).send();
  }

  /**
   * Bind event to the socket.
   *
   * @chainable
   * @method on
   * @param {String} eventName Event name
   * @param {Function} fn Event handler function
   * @return {SailsSocketClient}
   */
  on(eventName, fn) {
    this.socket.on(eventName, fn);
    return this;
  }

  /**
   * Unbind event from the socket.
   *
   * @chainable
   * @method off
   * @param {String} eventName Event name
   * @param {Function} fn Event handler function
   * @return {SailsSocketClient}
   */
  off(eventName, fn) {
    this.socket.off(eventName, fn);
    return this;
  }

}

import 'sails.io.js';

let io = PLATFORM.global.io;
// There is no io in the NodeJS
if (io) {
  io.sails.autoConnect = false;
}

export function configure(config, configCallback) {
  let sails = new SailsSocketClient();

  if (configCallback !== undefined && typeof(configCallback) === 'function') {
    configCallback(sails, io);
  }

  sails.setSocket(io.sails.connect());

  config.instance(SailsSocketClient, sails);
}

export {
  configure,
  SailsSocketClient,
  CSRFInterceptor,
  LoggerInterceptor
};
