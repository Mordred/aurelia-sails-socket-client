import { LogManager } from 'aurelia-framework';

var logger = LogManager.getLogger('sails');

export default class LoggerInterceptor {

  request(message) {
    logger.debug('Sending message to sails', message);
    // Do not forget return the message
    return message;
  }

  response(response) {
    logger.debug('Receiving response from sails', response);
    // Do not forget return the response
    return response;
  }

  responseError(response) {
    logger.error('There was an error during sails request', response);
    // Do not forget re-throw the response
    throw response;
  }

}
