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

      return Promise.all(promises).then(() => resolve(message)).catch(reject);
    }).then((message) => {

        var processRequest = (message) => {
          return new Promise((resolve, reject) => {
            client.socket.request(message.options, function(data, jwr) {
              let response = new SocketResponseMessage(message, data, jwr);
              if (response.isSuccess) {
                resolve(response);
              } else {
                reject(response);
              }
            });
          });
        };

        // [ onFullfilled, onReject ] pairs
        var chain = [[processRequest, undefined]];
        // Apply interceptors chain from the message.interceptors
        var interceptors = message.interceptors || [];
        interceptors.forEach(function (interceptor) {
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

        var interceptorsPromise = Promise.resolve(message);

        while (chain.length) {
          interceptorsPromise = interceptorsPromise.then(...chain.shift());
        }

        return interceptorsPromise;
    });

  }

}
