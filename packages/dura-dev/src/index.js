#!/usr/bin/env node

import getWebpackDllConfig from "./webpack.dll.config";

const program = require('commander')
const clc = require('cli-color')
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')

import getWebpackConfig from './webpack.config'


program
    .usage('<command> [options]')

program
    .command('dev')
    .description('start dev server')
    .action(function (type, name) {

        const hasConfig = fs.existsSync(path.join(process.cwd(), '.durc'))

        if (!hasConfig) {
            console.error("配置文件不存在！")
            return;
        }

        const configBuffer = fs.readFileSync(path.join(process.cwd(), '.durc'));

        const config = JSON.parse(configBuffer.toString());

        const appCompilerCallback = function (err, stat) {
            console.log("app compiler done")
        }

        if (config?.dll && !fs.existsSync(path.join(process.cwd(), ".dura", "vendor.dll.js"))) {
            webpack(getWebpackDllConfig(config)).run(function (err, stat) {
                if (!err) {
                    console.log("dll compiler done")
                    webpack(getWebpackConfig(config)).run(appCompilerCallback)
                }
            })
        } else {
            webpack(getWebpackConfig(config)).run(appCompilerCallback)
        }

    })

program
    .command('build')
    .description('build your app')
    .action(function (type, name) {
        console.log('build')
    })


program.parse(process.argv);