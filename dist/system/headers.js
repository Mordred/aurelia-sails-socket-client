System.register([], function (_export) {
  var _classCallCheck, Headers;

  return {
    setters: [],
    execute: function () {
      "use strict";

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Headers = (function () {
        function Headers() {
          var headers = arguments[0] === undefined ? {} : arguments[0];

          _classCallCheck(this, Headers);

          this.headers = headers;
        }

        Headers.prototype.add = function add(key, value) {
          this.headers[key] = value;
        };

        Headers.prototype.get = function get(key) {
          return this.headers[key];
        };

        Headers.prototype.clear = function clear() {
          this.headers = {};
        };

        return Headers;
      })();

      _export("Headers", Headers);
    }
  };
});