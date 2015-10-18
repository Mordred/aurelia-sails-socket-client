import {PLATFORM} from 'aurelia-pal';

export {SailsSocketClient} from './sails-socket-client';
export * from './interceptors';

//import socketIOClient from 'sails.io.js/dependencies/socket.io.min';

import { SailsSocketClient  } from './sails-socket-client';
import 'sails.io.js';

let io = PLATFORM.global.io;
io.sails.autoConnect = false;

export function configure(config, configCallback) {

  let sails = new SailsSocketClient();

  if (configCallback !== undefined && typeof(configCallback) === 'function') {
    configCallback(sails, io);
  }

  sails.setSocket(io.sails.connect());

  config.instance(SailsSocketClient, sails);
}
