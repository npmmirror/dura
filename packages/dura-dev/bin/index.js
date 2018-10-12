#!/usr/bin/env node
"use strict";

var _webpackDll = _interopRequireDefault(require("./webpack.dll.config"));

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

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

  if ((config === null || config === void 0 ? void 0 : config.dll) && !fs.existsSync(path.join(process.cwd(), ".dura", "vendor-manifest.json"))) {
    webpack((0, _webpackDll.default)(config), function (err, stat) {
      console.log("dll compiler done");
      stat.toJson().errors.forEach(console.log);

      if (!err) {
        new _webpackDevServer.default(webpack((0, _webpack.default)(config)), {
          hot: true,
          open: true,
          watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
          },
          stats: {
            colors: true
          }
        }).listen(9999, '127.0.0.1', function () {});
      }
    });
  } else {
    new _webpackDevServer.default(webpack((0, _webpack.default)(config)), {
      hot: true,
      open: true,
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      },
      stats: {
        colors: true
      }
    }).listen(9999, '127.0.0.1', function () {});
  }
});
program.command('build').description('build your app').action(function (type, name) {
  console.log('build');
});
program.parse(process.argv);