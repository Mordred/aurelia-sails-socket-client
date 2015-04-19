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
    this.beforeRequestTransformers = [];
    this.afterRequestTransformers = [];

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
   * Configure this SailsClient with default settings to be used by all requests.
   *
   * @method configure
   * @param {Function} fn A function that takes a RequestBuilder as an argument.
   * @chainable
   */
  configure(fn) {
    var builder = new RequestBuilder(this);
    fn(builder);
    this.beforeRequestTransformers = builder.transformers;
    return this;
  }

  /**
   * Returns a new RequestBuilder for this SailsClient instance that can be used to build and send socket requests.
   *
   * @method createRequest
   * @param uri The target URI.
   * @type RequestBuilder
   */
  createRequest(uri) {
    let builder = new RequestBuilder(this);

    if (uri) {
      builder.withUri(uri);
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

    transformers = transformers || [].concat(this.beforeRequestTransformers, this.afterRequestTransformers);

    for(i = 0, ii = transformers.length; i < ii; ++i){
      transformPromises.push(transformers[i](this, processor, message));
    }

    promise = Promise.all(transformPromises).then(() => {
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
   * @param {String} uri The target URI.
   * @return {Promise} A cancellable promise object.
   */
  delete(uri){
    return this.createRequest(uri).asDelete().send();
  }

  /**
   * Sends an GET request.
   *
   * @method get
   * @param {String} uri The target URI.
   * @return {Promise} A cancellable promise object.
   */
  get(uri){
    return this.createRequest(uri).asGet().send();
  }

  /**
   * Sends an HEAD request.
   *
   * @method head
   * @param {String} uri The target URI.
   * @return {Promise} A cancellable promise object.
   */
  head(uri){
    return this.createRequest(uri).asHead().send();
  }

  /**
   * Sends an OPTIONS request.
   *
   * @method options
   * @param {String} uri The target URI.
   * @return {Promise} A cancellable promise object.
   */
  options(uri){
    return this.createRequest(uri).asOptions().send();
  }

  /**
   * Sends an PUT request.
   *
   * @method put
   * @param {String} uri The target URI.
   * @param {Object} uri The request payload.
   * @return {Promise} A cancellable promise object.
   */
  put(uri, content){
    return this.createRequest(uri).asPut().withContent(content).send();
  }

  /**
   * Sends an PATCH request.
   *
   * @method patch
   * @param {String} uri The target URI.
   * @param {Object} uri The request payload.
   * @return {Promise} A cancellable promise object.
   */
  patch(uri, content){
    return this.createRequest(uri).asPatch().withContent(content).send();
  }

  /**
   * Sends an POST request.
   *
   * @method post
   * @param {String} uri The target URI.
   * @param {Object} uri The request payload.
   * @return {Promise} A cancellable promise object.
   */
  post(uri, content){
    return this.createRequest(uri).asPost().withContent(content).send();
  }

}
