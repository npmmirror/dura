#!/usr/bin/env node
"use strict";

var _webpack = _interopRequireDefault(require("./webpack.config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var program = require('commander');

var clc = require('cli-color');

var path = require('path');

var fs = require('fs');

var webpack = require('webpack');

program.usage('<command> [options]');
program.command('dev').description('start dev server').action(function (type, name) {
  fs.readFile(path.join(process.cwd(), '.dura'), null, function (err, data) {
    var config = JSON.parse(data);
    console.log(config);
    console.log("\r\n\r\n");
    var webpackConfig = (0, _webpack.default)(config);
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