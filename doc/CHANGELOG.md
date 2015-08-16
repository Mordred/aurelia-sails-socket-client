### 0.6.0 (2015-08-16)


#### Bug Fixes

* **sails-socket-client:** Use correct import for core-js ([e5fb7701](http://github.com/Mordred/aurelia-sails-socket-client/commit/e5fb77011b0c5562a096f0aa8473eac0d4d5e810))


#### Features

* **events:** Add bind and unbind to Sails resource events. ([87f1d56c](http://github.com/Mordred/aurelia-sails-socket-client/commit/87f1d56c29de7d66e6fe0a9e7a3e61587f18d0aa))


### 0.5.0 (2015-08-10)


#### Features

* **deps:** update dependencies ([98675a94](http://github.com/Mordred/aurelia-sails-socket-client/commit/98675a94e90145a6b0f32cee64d079c22d3606b5))


### 0.4.0 (2015-06-23)


#### Features

* **LoggerInterceptor:** added LoggerInterceptor for debuging messages ([8196903b](http://github.com/Mordred/aurelia-sails-socket-client/commit/8196903b565a7124902611a5eb8e57dada378b94))

#### Breaking Changes

* This is breaking API change to interceptor configuration.
To update, replace uses of `addInterceptor` with `withInterceptor` called inside
`configure`. See [example](https://github.com/Mordred/aurelia-sails-socket-client/commit/7a3bd4ea864e12e9969ff600c537e315ace98bb7#diff-089cffdd38b1054e1d0332359219fbed)

 ([b55aa5f7](http://github.com/Mordred/aurelia-sails-socket-client/commit/b55aa5f79779c76cf8d410dda6f9dd69295d0c5f))


### 0.3.0 (2015-05-06)

#### Breaking Changes

* This is breaking API change to SocketRequestMessage and RequestBuild.
To update, replace uses of `withUri`, `withBaseUri` and `uri` with `withUrl`,
`withBaseUrl` and `url`, as appropriate.

 ([78af41a3](http://github.com/Mordred/aurelia-sails-socket-client/commit/78af41a353a32406a8221c9e13117e8cc9a418ff))


### 0.2.0 (2015-04-22)


#### Features

* **interceptors:** added support for interceptors ([8abd045c](http://github.com/Mordred/aurelia-sails-socket-client/commit/8abd045c9a10409c3e1252428d42945da3e9ea62))


### 0.1.1 (2015-04-19)


#### Features

* **plugin:** allow to register as aurelia plugin during bootstrap phase ([5ab389c7](http://github.com/Mordred/aurelia-sails-socket-client/commit/5ab389c7b2396635b227a02a5c950355718814ee))


### 0.1.0 (2015-04-17)
