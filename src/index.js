import {SailsSocketClient} from './sails-socket-client';
import {CSRFInterceptor, LoggerInterceptor} from './interceptors';

import sailsIO from 'sails.io.js';
import socketIO from 'socket.io-client';

export function configure(config, configCallback) {
  let io = sailsIO(socketIO);
  let sails = new SailsSocketClient();

  if (configCallback !== undefined && typeof(configCallback) === 'function') {
    configCallback(sails, io);
  }

  sails.setSocket(io.sails.connect());

  config.instance(SailsSocketClient, sails);
}

export {
  configure,
  SailsSocketClient,
  CSRFInterceptor,
  LoggerInterceptor
};
