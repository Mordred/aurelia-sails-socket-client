export {SailsSocketClient} from './sails-socket-client';
export * from './interceptors';

//import socketIOClient from 'sails.io.js/dependencies/socket.io.min';

import { SailsSocketClient  } from './sails-socket-client';
import 'sails.io.js';

let io = window.io;
io.sails.autoConnect = false;

export function configure(aurelia, configCallback) {

  let sails = new SailsSocketClient();

  if (configCallback !== undefined && typeof(configCallback) === 'function') {
    configCallback(sails, io);
  }

  sails.setSocket(io.sails.connect());

  aurelia.container.registerInstance(SailsSocketClient, sails);
}
