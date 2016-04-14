import {join, buildQueryString} from 'aurelia-path';

import {Headers} from './headers';
import {RequestMessageProcessor} from './request-message-processor';

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
