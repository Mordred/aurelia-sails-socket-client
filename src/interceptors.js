import core from 'core-js';

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
    } else {
      return new Promise((resolve, reject) => {
        this.client.get(this.url).then(response => {
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
