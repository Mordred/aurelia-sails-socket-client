import { bootstrap } from 'aurelia-bootstrapper';
import { CSRFInterceptor, SailsSocketClient } from 'aurelia-sails-socket-client';

import LoggerInterceptor from './interceptors/logger-interceptor';

bootstrap(aurelia => {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-animator-css')
    .plugin('aurelia-sails-socket-client', (sails) => {
      sails.configure(x => {
        x.withBaseUrl('/api/v1');
      });

      // Add CSRF token interceptor
      sails.addInterceptor(new CSRFInterceptor('/csrfToken', sails));
      sails.addInterceptor(new LoggerInterceptor());
    });

  aurelia.start().then(a => a.setRoot("js/app", document.body))
});
