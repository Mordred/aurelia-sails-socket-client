System.register(['core-js', './socket-response-message'], function (_export) {
  var core, SocketResponseMessage, _classCallCheck, _createClass, RequestMessageProcessor;

  return {
    setters: [function (_coreJs) {
      core = _coreJs['default'];
    }, function (_socketResponseMessage) {
      SocketResponseMessage = _socketResponseMessage.SocketResponseMessage;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      RequestMessageProcessor = (function () {
        function RequestMessageProcessor(transformers) {
          _classCallCheck(this, RequestMessageProcessor);

          this.transformers = transformers;
        }

        _createClass(RequestMessageProcessor, [{
          key: 'abort',
          value: function abort() {
            throw new Error('Cannot abort socket request');
          }
        }, {
          key: 'process',
          value: function process(client, message) {
            var _this = this;

            return new Promise(function (resolve, reject) {
              var transformers = _this.transformers,
                  promises = [],
                  i,
                  ii;

              for (i = 0, ii = transformers.length; i < ii; ++i) {
                promises.push(transformers[i](client, _this, message));
              }

              Promise.all(promises).then(function () {
                return client.socket.request(message.options, function (data, jwr) {
                  var response = new SocketResponseMessage(message, data, jwr);
                  if (response.isSuccess) {
                    resolve(response);
                  } else {
                    reject(response);
                  }
                });
              });
            });
          }
        }]);

        return RequestMessageProcessor;
      })();

      _export('RequestMessageProcessor', RequestMessageProcessor);
    }
  };
});