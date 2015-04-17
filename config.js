System.config({
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "aurelia-sails-socket-client/*": "dist/system/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "aurelia-path": "github:aurelia/path@0.5.0",
    "core-js": "github:zloirock/core-js@0.8.1",
    "sails.io.js": "github:balderdashy/sails.io.js@0.11.5",
    "traceur": "github:jmcriffey/bower-traceur@0.0.87",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.87"
  }
});

