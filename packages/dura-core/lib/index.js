"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DuraCore = require("./DuraCore");

Object.keys(_DuraCore).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _DuraCore[key];
    }
  });
});