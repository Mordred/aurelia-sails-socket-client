import { Headers } from './headers';

export class SocketResponseMessage {

  // JWR ==> "JSON WebSocket Response" from sails.io.js
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

}
