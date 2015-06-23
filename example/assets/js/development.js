import { bootstrap } from 'aurelia-bootstrapper';
import { CSRFInterceptor, LoggerInterceptor, SailsSocketClient } from 'aurelia-sails-socket-client';

bootstrap(aurelia => {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-animator-css')
    .plugin('aurelia-sails-socket-client', (sails) => {
      sails.configure(x => {
        x.withBaseUrl('/api/v1');

        // Add CSRF token interceptor
        x.withInterceptor(new CSRFInterceptor('/csrfToken', sails));
        x.withInterceptor(new LoggerInterceptor());
      });

    });

  aurelia.start().then(a => a.setRoot("js/app", document.body))
});
