System.register(['core-js', './socket-response-message'], function (_export) {
  var core, SocketResponseMessage, _classCallCheck, RequestMessageProcessor;

  return {
    setters: [function (_coreJs) {
      core = _coreJs['default'];
    }, function (_socketResponseMessage) {
      SocketResponseMessage = _socketResponseMessage.SocketResponseMessage;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      RequestMessageProcessor = (function () {
        function RequestMessageProcessor(transformers) {
          _classCallCheck(this, RequestMessageProcessor);

          this.transformers = transformers;
        }

        RequestMessageProcessor.prototype.abort = function abort() {
          throw new Error('Cannot abort socket request');
        };

        RequestMessageProcessor.prototype.process = function process(client, message) {
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
        };

        return RequestMessageProcessor;
      })();

      _export('RequestMessageProcessor', RequestMessageProcessor);
    }
  };
});