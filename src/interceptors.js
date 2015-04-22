import core from 'core-js';

export class CSRFInterceptor {

  /**
   * @constructor
   * @param uri URI of the sails CSRF getter
   * @param {SailsSocketClient} client Client for getting CSRF from server
   * @param token Optional token - use when you have prefetched token, e.g. rendered in HTML
   */
  constructor(uri, client, token) {
    this.uri = uri;
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
    if (message.method === 'get' || message.uri === this.uri) {
      return message;
    }

    if (this.token) {
      this.setCsrfTokenHeader(message);
      return message;
    } else {
      return new Promise((resolve, reject) => {
        this.client.get(this.uri).then(response => {
          this.token = response.content._csrf;
          this.setCsrfTokenHeader(message);
          resolve(message);
        }).catch(reject);
      });
    }

  }

  setCsrfTokenHeader(message) {
    message.headers.add('X-Csrf-Token', this.token);
    return message;
  }

}
