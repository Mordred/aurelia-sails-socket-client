define(['exports', 'core-js', './socket-response-message'], function (exports, _coreJs, _socketResponseMessage) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

  exports.__esModule = true;

  var _core = _interopRequire(_coreJs);

  var RequestMessageProcessor = (function () {
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
            var response = new _socketResponseMessage.SocketResponseMessage(message, data, jwr);
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

  exports.RequestMessageProcessor = RequestMessageProcessor;
});