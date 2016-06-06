declare module 'aurelia-sails-socket-client' {
  import * as LogManager from 'aurelia-logging';
  import {
    join,
    buildQueryString
  } from 'aurelia-path';
  import {
    DOM
  } from 'aurelia-pal';
  import sailsIO from 'sails.io.js';
  import socketIO from 'socket.io-client';
  export function configure(config?: any, configCallback?: any): any;
  export class Headers {
    constructor(headers?: any);
    add(key?: any, value?: any): any;
    get(key?: any): any;
    clear(): any;
  }
  export class SocketResponseMessage {
    
    // JWR ==> "JSON WebSocket Response" from sails.io.js
    constructor(requestMessage?: any, body?: any, JWR?: any);
    content: any;
  }
  export class RequestMessageProcessor {
    constructor(transformers?: any);
    abort(): any;
    process(client?: any, requestMessage?: any): any;
  }
  export class SocketRequestMessage {
    constructor(method?: any, url?: any, content?: any, headers?: any);
    options: any;
  }
  export function createSocketRequestMessageProcessor(): any;
  export class RequestBuilder {
    constructor(client?: any);
    static addHelper(name?: any, fn?: any): any;
    send(): any;
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
    constructor(socket?: any);
    
    /**
       * Change socket instance
       *
       * @method setSocket
       * @param {SailsSocket} socket A sails socket instance
       * @chainable
       */
    setSocket(socket?: any): any;
    
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
    addInterceptor(interceptor?: any): any;
    
    /**
       * Configure this SailsClient with default settings to be used by all requests.
       *
       * @method configure
       * @param {Function} fn A function that takes a RequestBuilder as an argument.
       * @chainable
       */
    configure(fn?: any): any;
    
    /**
       * Returns a new RequestBuilder for this SailsClient instance that can be used to build and send socket requests.
       *
       * @method createRequest
       * @param url The target URL.
       * @type RequestBuilder
       */
    createRequest(url?: any): any;
    
    /**
       * Sends a message using the underlying networking stack.
       *
       * @method send
       * @param requestMessage A configured SocketRequestMessage.
       * @param {Array} transformers A collection of transformers to apply to the socket request.
       * @return {Promise} A cancellable promise object.
       */
    send(requestMessage?: any, transformers?: any): any;
    
    /**
       * Sends an DELETE request.
       *
       * @method delete
       * @param {String} url The target URL.
       * @param {object|undefined} content Params for the URL.
       * @return {Promise} A cancellable promise object.
       */
    delete(url?: any, content?: any): any;
    
    /**
       * Sends an GET request.
       *
       * @method get
       * @param {String} url The target URL.
       * @param {Object|undefined} content The request payload.
       * @return {Promise} A cancellable promise object.
       */
    get(url?: any, content?: any): any;
    
    /**
       * Sends an HEAD request.
       *
       * @method head
       * @param {String} url The target URL.
       * @param {Object|undefined} content The request payload.
       * @return {Promise} A cancellable promise object.
       */
    head(url?: any, content?: any): any;
    
    /**
       * Sends an OPTIONS request.
       *
       * @method options
       * @param {String} url The target URL.
       * @param {Object|undefined} content The request payload.
       * @return {Promise} A cancellable promise object.
       */
    options(url?: any, content?: any): any;
    
    /**
       * Sends an PUT request.
       *
       * @method put
       * @param {String} url The target URL.
       * @param {Object|undefined} content The request payload.
       * @return {Promise} A cancellable promise object.
       */
    put(url?: any, content?: any): any;
    
    /**
       * Sends an PATCH request.
       *
       * @method patch
       * @param {String} url The target URL.
       * @param {Object|undefined} content The request payload.
       * @return {Promise} A cancellable promise object.
       */
    patch(url?: any, content?: any): any;
    
    /**
       * Sends an POST request.
       *
       * @method post
       * @param {String} url The target URL.
       * @param {Object|undefined} content The request payload.
       * @return {Promise} A cancellable promise object.
       */
    post(url?: any, content?: any): any;
    
    /**
       * Bind event to the socket.
       *
       * @chainable
       * @method on
       * @param {String} eventName Event name
       * @param {Function} fn Event handler function
       * @return {SailsSocketClient}
       */
    on(eventName?: any, fn?: any): any;
    
    /**
       * Unbind event from the socket.
       *
       * @chainable
       * @method off
       * @param {String} eventName Event name
       * @param {Function} fn Event handler function
       * @return {SailsSocketClient}
       */
    off(eventName?: any, fn?: any): any;
  }
  export class CSRFInterceptor {
    
    /**
       * @constructor
       * @param url URL of the sails CSRF getter
       * @param {SailsSocketClient} client Client for getting CSRF from server
       * @param token Optional token - use when you have prefetched token, e.g. rendered in HTML
       */
    constructor(url?: any, client?: any, token?: any);
    
    /**
       * Request message interceptor
       *
       * @param message
       * @returns {SocketRequestMessage}
       */
    request(message?: any): any;
    setCsrfTokenHeader(message?: any): any;
  }
  export class LoggerInterceptor {
    request(message?: any): any;
    response(response?: any): any;
    responseError(response?: any): any;
  }
}