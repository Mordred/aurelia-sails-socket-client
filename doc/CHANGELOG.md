## 0.14.0 (2017-02-18)


#### Features

* **dependencies:** Remove aurelia-pal dependency ([fca28e7c](http://github.com/Mordred/aurelia-sails-socket-client/commit/fca28e7c8b823ff535071424554099b42cd5ac34))
* **karma:** Upgrade karma dependency ([8e36b5e8](http://github.com/Mordred/aurelia-sails-socket-client/commit/8e36b5e80f5ab40bd0eebb8e6cd61bb0730da97c))


#### Breaking Changes

* DOM event 'aurelia-sails-socket-client-requests-drained' was removed.
Because of this event we had to import aurelia-pal dependency.
If you need this event, you can easily implement it using interceptor.

 ([fca28e7c](http://github.com/Mordred/aurelia-sails-socket-client/commit/fca28e7c8b823ff535071424554099b42cd5ac34))


### 0.13.1 (2016-06-06)


#### Bug Fixes

* **autoConnect:** Disable autoconnect ([2f7d43c5](http://github.com/Mordred/aurelia-sails-socket-client/commit/2f7d43c5cbad62fb6bfa6b05e84e188267a5e49f))


## 0.13.0 (2016-06-06)


#### Bug Fixes

* **build:** Removed unecessary exports ([5272d5bd](http://github.com/Mordred/aurelia-sails-socket-client/commit/5272d5bd73ce39e3c0874391015f663dd1aa787a))
* **d.ts:** Fixed files ordering ([2df9cf3d](http://github.com/Mordred/aurelia-sails-socket-client/commit/2df9cf3d4379e30ce5e52a53142782bf7ff75dd7))
* **override:** Fixed need for sails.io.js override ([c27fad3c](http://github.com/Mordred/aurelia-sails-socket-client/commit/c27fad3c31705ecd5388253ae425e7c2889c0c6a))
* **package:** Fixed package.json ([b6ec25af](http://github.com/Mordred/aurelia-sails-socket-client/commit/b6ec25af14741d2d5c1fd4678cef0e5540e3e265))


### 0.12.1 (2016-04-14)


#### Bug Fixes

* **package:** Fixed package.json ([b6ec25af](http://github.com/Mordred/aurelia-sails-socket-client/commit/b6ec25af14741d2d5c1fd4678cef0e5540e3e265))


## 0.12.0 (2016-04-14)


#### Features

* **all:** Removed core-js dependency and shrink build to one file ([3d33dbac](http://github.com/Mordred/aurelia-sails-socket-client/commit/3d33dbac3cf17f0e0b5481adbfe492e41785f91a))


## 0.11.0 (2016-02-19)


#### Bug Fixes

* **example:**
  * Forgotten aurelia-bundler to packages.json ([a0f334c1](http://github.com/Mordred/aurelia-sails-socket-client/commit/a0f334c1036596e23e5321c0d4d39673cc87f428))
  * Fixed changing completed after recent changes in the Aurelia ([2ac1a93b](http://github.com/Mordred/aurelia-sails-socket-client/commit/2ac1a93bd180ac85fae333f076ee2b3084345b63))
  * Fix running sails in production environment ([68b121dd](http://github.com/Mordred/aurelia-sails-socket-client/commit/68b121dd0cffc3236302cf1e2127adf6ad67ecbd))


#### Features

* **all:** Update sails.io.js to 0.13.5 ([776c62f0](http://github.com/Mordred/aurelia-sails-socket-client/commit/776c62f021c5a0025a0c6883f64b497c0711c579))
* **example:** Add simple bundling example for production ([0de5c0ff](http://github.com/Mordred/aurelia-sails-socket-client/commit/0de5c0ffb0fcbb1fd3cde780c1097649e8f9d1bd))


### 0.10.2 (2016-01-05)


#### Bug Fixes

* **nodejs:** Fixed configuring autoConnect in the NodeJS environment ([92928166](http://github.com/Mordred/aurelia-sails-socket-client/commit/929281662032ee455973083f9785a266504d71d6))


### 0.10.1 (2015-12-30)


#### Bug Fixes

* **all:** Fixed wrong usage of custom event in trackRequestEnd() ([bb349479](http://github.com/Mordred/aurelia-sails-socket-client/commit/bb349479e269b5631db0a4e9b90c2d9a3c5ebff7))
* **dependencies:** Fixed missing aurelia-logging ([3621e105](http://github.com/Mordred/aurelia-sails-socket-client/commit/3621e105f23123973126bb39a67de948e24c9426))
* **interceptors:** Cache promise when fetching CSRF token ([cca33901](http://github.com/Mordred/aurelia-sails-socket-client/commit/cca339015e4740d415ef0c66fdbd2a52405c39e0))


## 0.10.0 (2015-11-19)


#### Bug Fixes

* **all:** Fixed wrong usage of custom event in trackRequestEnd() ([bb349479](http://github.com/Mordred/aurelia-sails-socket-client/commit/bb349479e269b5631db0a4e9b90c2d9a3c5ebff7))


## 0.9.0 (2015-11-12)


## 0.8.0 (2015-10-18)


#### Features

* **all:** Update to use PAL ([1d42e977](http://github.com/Mordred/aurelia-sails-socket-client/commit/1d42e977ac7ac0566149aa98ca93d1fea970c416))


### 0.7.0 (2015-09-17)


#### Breaking Changes

* This is a breaking change, because methods `get`, `delete`, `options` and
`head` on the client now set content instead of params, so that data are not set
to query string in the URL. When parsing query string in the Sails,
nested objects are not properly decoded to JS. This change should allow queries like
`sails.get('users', { username: { contains: 'example' }})` to be run correctly against
blueprints.

 ([550d75b0](http://github.com/Mordred/aurelia-sails-socket-client/commit/550d75b036946c261884ac6f256552ad3ac87f42))


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
