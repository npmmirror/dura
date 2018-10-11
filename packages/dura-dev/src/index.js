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

        fs.readFile(path.join(process.cwd(), '.durc'), null, function (err, data) {

            const config = JSON.parse(data);

            const webpackConfig = getWebpackConfig(config)

            if (config.dll && typeof config.dll === "object" && config.dll.length > 0) {
                // webpack(getWebpackDllConfig({dll: config.dll})).run(function (dllWebpackErr, stat) {
                //     console.log("dll",stat.toJson().errors)
                // })
            }

            console.log(config)

            console.log("\r\n\r\n")

            console.log(JSON.stringify(webpackConfig))

            webpack(webpackConfig)
                .run(function (webpackErr, stat) {
                    console.log(webpackErr, stat.toJson().errors)
                    console.log('done')
                })
        })
    })

program
    .command('build')
    .description('build your app')
    .action(function (type, name) {
        console.log('build')
    })


program.parse(process.argv);