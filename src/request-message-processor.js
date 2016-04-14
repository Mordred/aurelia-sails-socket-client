import {SocketResponseMessage} from './socket-response-message';

export class RequestMessageProcessor {

  constructor(transformers) {
    this.transformers = transformers;
  }

  abort() {
    // TODO: Is this really impossible?
    throw new Error('Cannot abort socket request');
  }

  process(client, requestMessage) {
    return new Promise((resolve, reject) => {
      let transformers = this.transformers;
      let promises = [];
      let i;
      let ii;


      for (i = 0, ii = transformers.length; i < ii; ++i) {
        promises.push(transformers[i](client, this, requestMessage));
      }

      return Promise.all(promises).then(() => resolve(requestMessage)).catch(reject);
    }).then((message) => {
      let processRequest = (currentMessage) => {
        return new Promise((resolve, reject) => {
          client.socket.request(currentMessage.options, function(data, jwr) {
            let response = new SocketResponseMessage(currentMessage, data, jwr);
            if (response.isSuccess) {
              resolve(response);
            } else {
              reject(response);
            }
          });
        });
      };

      // [ onFullfilled, onReject ] pairs
      let chain = [[processRequest, undefined]];
      // Apply interceptors chain from the message.interceptors
      let interceptors = message.interceptors || [];
      interceptors.forEach(function(interceptor) {
        if (interceptor.request || interceptor.requestError) {
          chain.unshift([
            interceptor.request ? interceptor.request.bind(interceptor) : undefined,
            interceptor.requestError ? interceptor.requestError.bind(interceptor) : undefined
          ]);
        }

        if (interceptor.response || interceptor.responseError) {
          chain.push([
            interceptor.response ? interceptor.response.bind(interceptor) : undefined,
            interceptor.responseError ? interceptor.responseError.bind(interceptor) : undefined
          ]);
        }
      });

      let interceptorsPromise = Promise.resolve(message);

      while (chain.length) {
        interceptorsPromise = interceptorsPromise.then(...chain.shift());
      }

      return interceptorsPromise;
    });
  }

}
