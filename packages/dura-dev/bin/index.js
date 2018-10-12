#!/usr/bin/env node
"use strict";

var _webpackDll = _interopRequireDefault(require("./webpack.dll.config"));

var _webpack = _interopRequireDefault(require("./webpack.config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var program = require('commander');

var clc = require('cli-color');

var path = require('path');

var fs = require('fs');

var webpack = require('webpack');

program.usage('<command> [options]');
program.command('dev').description('start dev server').action(function (type, name) {
  var hasConfig = fs.existsSync(path.join(process.cwd(), '.durc'));

  if (!hasConfig) {
    console.error("配置文件不存在！");
    return;
  }

  var configBuffer = fs.readFileSync(path.join(process.cwd(), '.durc'));
  var config = JSON.parse(configBuffer.toString());

  var appCompilerCallback = function appCompilerCallback(err, stat) {
    // stat.toJson().modules.forEach(function (item) {
    //     console.log(item.identifier)
    // })
    console.log("app compiler done");
  };

  if ((config === null || config === void 0 ? void 0 : config.dll) && !fs.existsSync(path.join(process.cwd(), ".dura", "vendor.dll.js"))) {
    webpack((0, _webpackDll.default)(config)).run(function (err, stat) {
      if (!err) {
        console.log("dll compiler done");
        webpack((0, _webpack.default)(config)).run(appCompilerCallback);
      }
    });
  } else {
    var compiler = webpack((0, _webpack.default)(config));
    compiler.run(appCompilerCallback);
  }
});
program.command('build').description('build your app').action(function (type, name) {
  console.log('build');
});
program.parse(process.argv);