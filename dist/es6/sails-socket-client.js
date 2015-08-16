/* jshint esnext:true */
import core from 'core-js';

import { Headers } from './headers';
import { RequestBuilder } from './request-builder';
import { SocketRequestMessage, createSocketRequestMessageProcessor } from './socket-request-message';

function trackRequestStart(client, processor) {
  client.pendingRequests.push(processor);
  client.isRequesting = true;
}

function trackRequestEnd(client, processor) {
  var index = client.pendingRequests.indexOf(processor);

  client.pendingRequests.splice(index, 1);
  client.isRequesting = client.pendingRequests.length > 0;

  if (!client.isRequesting) {
    var evt = new window.CustomEvent('aurelia-sails-socket-client-requests-drained', {bubbles: true, cancelable: true});
    setTimeout(() => document.dispatchEvent(evt), 1);
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
    var builder = new RequestBuilder(this);
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
   * @param message A configured SocketRequestMessage.
   * @param {Array} transformers A collection of transformers to apply to the socket request.
   * @return {Promise} A cancellable promise object.
   */
  send(message, transformers){
    var processor, promise, i, ii, transformPromises = [];

    processor = createSocketRequestMessageProcessor();
    trackRequestStart(this, processor);

    transformers = transformers || this.requestTransformers;

    promise = Promise.resolve(message)
      .then((message) => {
        // First apply transformers passed to the client.send()
        for(i = 0, ii = transformers.length; i < ii; ++i){
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
   * @param {object|undefined} params Params for the URL.
   * @return {Promise} A cancellable promise object.
   */
  delete(url, params){
    return this.createRequest(url).asDelete().withParams(params).send();
  }

  /**
   * Sends an GET request.
   *
   * @method get
   * @param {String} url The target URL.
   * @param {object|undefined} params Params for the URL.
   * @return {Promise} A cancellable promise object.
   */
  get(url, params){
    return this.createRequest(url).asGet().withParams(params).send();
  }

  /**
   * Sends an HEAD request.
   *
   * @method head
   * @param {String} url The target URL.
   * @param {object|undefined} params Params for the URL.
   * @return {Promise} A cancellable promise object.
   */
  head(url, params){
    return this.createRequest(url).asHead().withParams(params).send();
  }

  /**
   * Sends an OPTIONS request.
   *
   * @method options
   * @param {String} url The target URL.
   * @param {object|undefined} params Params for the URL.
   * @return {Promise} A cancellable promise object.
   */
  options(url, params){
    return this.createRequest(url).asOptions().withParams(params).send();
  }

  /**
   * Sends an PUT request.
   *
   * @method put
   * @param {String} url The target URL.
   * @param {Object} url The request payload.
   * @return {Promise} A cancellable promise object.
   */
  put(url, content){
    return this.createRequest(url).asPut().withContent(content).send();
  }

  /**
   * Sends an PATCH request.
   *
   * @method patch
   * @param {String} url The target URL.
   * @param {Object} url The request payload.
   * @return {Promise} A cancellable promise object.
   */
  patch(url, content){
    return this.createRequest(url).asPatch().withContent(content).send();
  }

  /**
   * Sends an POST request.
   *
   * @method post
   * @param {String} url The target URL.
   * @param {Object} url The request payload.
   * @return {Promise} A cancellable promise object.
   */
  post(url, content){
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
