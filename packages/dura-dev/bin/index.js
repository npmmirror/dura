#!/usr/bin/env node
"use strict";

var _webpackDll = _interopRequireDefault(require("./webpack.dll.config"));

var _webpack = _interopRequireDefault(require("./webpack.config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var program = require('commander');

var clc = require('cli-color');

var path = require('path');

var fs = require('fs');

var webpack = require('webpack');

program.usage('<command> [options]');
program.command('dev').description('start dev server').action(function (type, name) {
  fs.readFile(path.join(process.cwd(), '.durc'), null, function (err, data) {
    var config = JSON.parse(data);
    var webpackConfig = (0, _webpack.default)(config);

    if (config.dll && _typeof(config.dll) === "object" && config.dll.length > 0) {// webpack(getWebpackDllConfig({dll: config.dll})).run(function (dllWebpackErr, stat) {
      //     console.log("dll",stat.toJson().errors)
      // })
    }

    console.log(config);
    console.log("\r\n\r\n");
    console.log(JSON.stringify(webpackConfig));
    webpack(webpackConfig).run(function (webpackErr, stat) {
      console.log(webpackErr, stat.toJson().errors);
      console.log('done');
    });
  });
});
program.command('build').description('build your app').action(function (type, name) {
  console.log('build');
});
program.parse(process.argv);