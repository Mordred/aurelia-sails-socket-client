import * as LogManager from 'aurelia-logging';
import { join, buildQueryString } from 'aurelia-path';
import { DOM } from 'aurelia-pal';

import sailsIO from 'sails.io.js';
import socketIO from 'socket.io-client';

export function configure(config, configCallback) {
  let io = sailsIO(socketIO);
  io.sails.autoConnect = false;
  let sails = new SailsSocketClient();

  if (configCallback !== undefined && typeof configCallback === 'function') {
    configCallback(sails, io);
  }

  sails.setSocket(io.sails.connect());

  config.instance(SailsSocketClient, sails);
}

export let Headers = class Headers {

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

};

export let SocketResponseMessage = class SocketResponseMessage {
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

};

export let RequestMessageProcessor = class RequestMessageProcessor {

  constructor(transformers) {
    this.transformers = transformers;
  }

  abort() {
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
    }).then(message => {
      let processRequest = currentMessage => {
        return new Promise((resolve, reject) => {
          client.socket.request(currentMessage.options, function (data, jwr) {
            let response = new SocketResponseMessage(currentMessage, data, jwr);
            if (response.isSuccess) {
              resolve(response);
            } else {
              reject(response);
            }
          });
        });
      };

      let chain = [[processRequest, undefined]];

      let interceptors = message.interceptors || [];
      interceptors.forEach(function (interceptor) {
        if (interceptor.request || interceptor.requestError) {
          chain.unshift([interceptor.request ? interceptor.request.bind(interceptor) : undefined, interceptor.requestError ? interceptor.requestError.bind(interceptor) : undefined]);
        }

        if (interceptor.response || interceptor.responseError) {
          chain.push([interceptor.response ? interceptor.response.bind(interceptor) : undefined, interceptor.responseError ? interceptor.responseError.bind(interceptor) : undefined]);
        }
      });

      let interceptorsPromise = Promise.resolve(message);

      while (chain.length) {
        interceptorsPromise = interceptorsPromise.then(...chain.shift());
      }

      return interceptorsPromise;
    });
  }

};

function buildFullUrl(message) {
  let url;
  let qs;

  if (message.url && message.url[0] === '/') {
    url = message.url;
  } else {
    url = join(message.baseUrl, message.url);
  }

  if (message.params) {
    qs = buildQueryString(message.params);
    url = qs ? `${ url }?${ qs }` : url;
  }

  return url;
}

export let SocketRequestMessage = class SocketRequestMessage {

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

};

export function createSocketRequestMessageProcessor() {
  return new RequestMessageProcessor([]);
}

export let RequestBuilder = class RequestBuilder {

  constructor(client) {
    this.client = client;
    this.transformers = client.requestTransformers.slice(0);
  }

  static addHelper(name, fn) {
    RequestBuilder.prototype[name] = function () {
      this.transformers.push(fn.apply(this, arguments));
      return this;
    };
  }

  send() {
    let message = new SocketRequestMessage();
    return this.client.send(message, this.transformers);
  }

};

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
  let index = client.pendingRequests.indexOf(processor);

  client.pendingRequests.splice(index, 1);
  client.isRequesting = client.pendingRequests.length > 0;

  if (!client.isRequesting) {
    let evt = DOM.createCustomEvent('aurelia-sails-socket-client-requests-drained', { bubbles: true, cancelable: true });
    setTimeout(() => DOM.dispatchEvent(evt), 1);
  }
}

export let SailsSocketClient = class SailsSocketClient {
  constructor(socket) {
    this.socket = socket;

    this.requestTransformers = [];

    this.interceptors = [];

    this.pendingRequests = [];
    this.isRequesting = false;
  }

  setSocket(socket) {
    this.socket = socket;
    return this;
  }

  addInterceptor(interceptor) {
    this.interceptors.unshift(interceptor);
    return this;
  }

  configure(fn) {
    let builder = new RequestBuilder(this);
    fn(builder);
    this.requestTransformers = builder.transformers;
    return this;
  }

  createRequest(url) {
    let builder = new RequestBuilder(this);

    if (url) {
      builder.withUrl(url);
    }

    return builder;
  }

  send(requestMessage, transformers) {
    let processor;
    let promise;
    let i;
    let ii;
    let transformPromises = [];

    processor = createSocketRequestMessageProcessor();
    trackRequestStart(this, processor);

    transformers = transformers || this.requestTransformers;

    promise = Promise.resolve(requestMessage).then(message => {
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

    promise.abort = promise.cancel = function () {
      processor.abort();
    };

    return promise;
  }

  delete(url, content) {
    return this.createRequest(url).asDelete().withContent(content).send();
  }

  get(url, content) {
    return this.createRequest(url).asGet().withContent(content).send();
  }

  head(url, content) {
    return this.createRequest(url).asHead().withContent(content).send();
  }

  options(url, content) {
    return this.createRequest(url).asOptions().withContent(content).send();
  }

  put(url, content) {
    return this.createRequest(url).asPut().withContent(content).send();
  }

  patch(url, content) {
    return this.createRequest(url).asPatch().withContent(content).send();
  }

  post(url, content) {
    return this.createRequest(url).asPost().withContent(content).send();
  }

  on(eventName, fn) {
    this.socket.on(eventName, fn);
    return this;
  }

  off(eventName, fn) {
    this.socket.off(eventName, fn);
    return this;
  }

};

const logger = LogManager.getLogger('sails');

export let CSRFInterceptor = class CSRFInterceptor {
  constructor(url, client, token) {
    this.url = url;
    this.client = client;
    this.token = token;
  }

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

};

export let LoggerInterceptor = class LoggerInterceptor {

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

};