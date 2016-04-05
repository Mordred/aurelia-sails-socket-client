import {PLATFORM} from 'aurelia-pal';

import {SailsSocketClient} from './sails-socket-client';
import {CSRFInterceptor, LoggerInterceptor} from './interceptors';

import 'sails.io.js';

let io = PLATFORM.global.io;
// There is no io in the NodeJS
if (io) {
  io.sails.autoConnect = false;
}

export function configure(config, configCallback) {

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
}
