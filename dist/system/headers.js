System.register([], function (_export) {
  var _classCallCheck, _createClass, Headers;

  return {
    setters: [],
    execute: function () {
      "use strict";

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      Headers = (function () {
        function Headers() {
          var headers = arguments[0] === undefined ? {} : arguments[0];

          _classCallCheck(this, Headers);

          this.headers = headers;
        }

        _createClass(Headers, [{
          key: "add",
          value: function add(key, value) {
            this.headers[key] = value;
          }
        }, {
          key: "get",
          value: function get(key) {
            return this.headers[key];
          }
        }, {
          key: "clear",
          value: function clear() {
            this.headers = {};
          }
        }]);

        return Headers;
      })();

      _export("Headers", Headers);
    }
  };
});