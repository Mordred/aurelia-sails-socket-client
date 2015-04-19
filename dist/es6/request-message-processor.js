import core from 'core-js';
import { SocketResponseMessage } from './socket-response-message';

export class RequestMessageProcessor {

  constructor(transformers) {
    this.transformers = transformers;
  }

  abort() {
    // TODO: Is this really impossible?
    throw new Error('Cannot abort socket request');
  }

  process(client, message) {
    return new Promise((resolve, reject) => {
      var transformers = this.transformers,
        promises = [],
        i, ii;


      for (i = 0, ii = transformers.length; i < ii; ++i) {
        promises.push(transformers[i](client, this, message));
      }

      Promise.all(promises).then(function() {
        return client.socket.request(message.options, function(data, jwr) {
          let response = new SocketResponseMessage(message, data, jwr);
          if (response.isSuccess) {
            resolve(response);
          } else {
            reject(response);
          }
        });
      });
    });
  }

}
