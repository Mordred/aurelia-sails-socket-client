'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _core = require('core-js');

var _core2 = _interopRequireWildcard(_core);

var _SocketResponseMessage = require('./socket-response-message');

var RequestMessageProcessor = (function () {
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
            var response = new _SocketResponseMessage.SocketResponseMessage(message, data, jwr);
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

exports.RequestMessageProcessor = RequestMessageProcessor;