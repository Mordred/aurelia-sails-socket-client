/* jshint esnext:true */
import {RequestBuilder} from './request-builder';
import {createSocketRequestMessageProcessor} from './socket-request-message';

function trackRequestStart(client, processor) {
  client.pendingRequests.push(processor);
  client.isRequesting = true;
}

function trackRequestEnd(client, processor) {
  let index = client.pendingRequests.indexOf(processor);

  client.pendingRequests.splice(index, 1);
  client.isRequesting = client.pendingRequests.length > 0;
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
