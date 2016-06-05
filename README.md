# aurelia-sails-socket-client

This library is part of the [Aurelia](http://www.aurelia.io/) platform and contains a simple, restful, message-based wrapper around sails.io client.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.durandal.io/). If you have questions, we invite you to join us on [![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge).

## Polyfills

* Depending on target browser(s), [core-js](https://github.com/zloirock/core-js) may be required for `Promise` support.

## Dependencies

* [aurelia-logging](https://github.com/aurelia/logging)
* [aurelia-pal](https://github.com/aurelia/pal)
* [aurelia-path](https://github.com/aurelia/path)
* [sails.io.js](https://github.com/balderdashy/sails.io.js)

## Used By

This library is used directly by applications only.

## Platform Support

This library can be used in the **browser** only.

## Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
4. To build the code, you can now run:

  ```shell
  gulp build
  ```
5. You will find the compiled code in the `dist` folder, available in three module formats: AMD, CommonJS and ES6.

6. See `gulpfile.js` for other tasks related to generating the docs and linting.

## Running The Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:

  ```shell
  npm install -g karma-cli
  ```
2. Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following commnand:

  ```shell
  npm install -g jspm
  ```
3. Install the client-side dependencies with jspm:

  ```shell
  jspm install
  ```

4. You can now run the tests with this command:

  ```shell
  karma start
  ```

## Example

### Load the plugin

During bootstrapping phase, you can now include the sails socket client plugin:

  ```js
  import { CSRFInterceptor, LoggerInterceptor } from 'aurelia-sails-socket-client';

  export function configure(aurelia) {
    aurelia.use
      .standardConfiguration()
      .developmentLogging()
      .plugin('aurelia-sails-socket-client', (sails, io) => {
        sails.configure(x => {
          x.withBaseUrl('/api/v1');

          // Example for CSRFInterceptor - if you are using Sails CSRF protection
          x.withInterceptor(new CSRFInterceptor('/csrfToken', sails));
          x.withInterceptor(new LoggerInterceptor());
        });

      });

    aurelia.start().then(a => a.setRoot('app', document.body));
  }
  ```

Now you can use it in you classes:

  ```js
  import { inject } from 'aurelia-framework';
  import { SailsSocketClient } from 'aurelia-sails-socket-client';

  @inject(SailsSocketClient)
  export class Login {

    constructor(sails) {
      this.sails = sails;
    }

    login(credentials) {
      this.sails.post("/login", credentials)
        .then((response) => alert("Success login"))
        .catch((response) => alert("Wrong credentials"));
    }

  }
  ```
