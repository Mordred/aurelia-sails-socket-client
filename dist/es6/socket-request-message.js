import { join, buildQueryString } from 'aurelia-path';

import { Headers } from './headers';
import { RequestMessageProcessor } from './request-message-processor';

function buildFullUri(message) {

  var uri, qs;
  // Message URI starts with / - as absolute URL
  if (message.uri && message.uri[0] == '/') {
    uri = message.uri;
  } else {
    uri = join(message.baseUri, message.uri);
  }

  if (message.params) {
    qs = buildQueryString(message.params);
    uri = qs ? `${uri}?${qs}` : uri;
  }

  return uri;
}

export class SocketRequestMessage {

  constructor(method, uri, content, headers) {
    this.method = method;
    this.uri = uri;
    this.content = content;
    this.headers = headers || new Headers();
  }

  get options() {
    return {
      method: this.method,
      url: buildFullUri(this),
      params: this.content,
      headers: this.headers.headers
    };
  }

}

export function createSocketRequestMessageProcessor() {
  return new RequestMessageProcessor([]);
}
