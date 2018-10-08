#!/usr/bin/env node

const program = require('commander')
const clc = require('cli-color')
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')

import getWebpackConfig from './webpackConfig'

const title = clc.xterm(46)

program
    .usage('<command> [options]')

program
    .command('dev')
    .description('start dev server')
    .action(function (type, name) {
        fs.readFile(path.join(process.cwd(), '.dura'), null, function (err, data) {

            const config = JSON.parse(data);

            console.log(config)

            console.log("\r\n\r\n")

            const webpackConfig = getWebpackConfig(config)

            console.log(JSON.stringify(webpackConfig))

            webpack(webpackConfig)
                .run(function (webpackErr,stat) {

                    console.log(webpackErr,stat.toJson().errors)
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