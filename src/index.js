import {SailsSocketClient} from './sails-socket-client';

import sailsIO from 'sails.io.js';
import socketIO from 'socket.io-client';

export function configure(config, configCallback) {
  let io = sailsIO(socketIO);
  io.sails.autoConnect = false;
  let sails = new SailsSocketClient();

  if (configCallback !== undefined && typeof(configCallback) === 'function') {
    configCallback(sails, io);
  }

  sails.setSocket(io.sails.connect());

  config.instance(SailsSocketClient, sails);
}
