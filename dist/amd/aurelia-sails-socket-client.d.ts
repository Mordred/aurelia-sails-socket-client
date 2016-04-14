declare module 'aurelia-sails-socket-client' {
  import * as LogManager from 'aurelia-logging';
  import {
    join,
    buildQueryString
  } from 'aurelia-path';
  import {
    DOM,
    PLATFORM
  } from 'aurelia-pal';
  import 'sails.io.js';
  export class CSRFInterceptor {
    
    /**
       * @constructor
       * @param url URL of the sails CSRF getter
       * @param {SailsSocketClient} client Client for getting CSRF from server
       * @param token Optional token - use when you have prefetched token, e.g. rendered in HTML
       */
    constructor(url: any, client: any, token: any);
    
    /**
       * Request message interceptor
       *
       * @param message
       * @returns {SocketRequestMessage}
       */
    request(message: any): any;
    setCsrfTokenHeader(message: any): any;
  }
  export class LoggerInterceptor {
    request(message: any): any;
    response(response: any): any;
    responseError(response: any): any;
  }
}