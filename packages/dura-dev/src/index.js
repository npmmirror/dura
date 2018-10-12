#!/usr/bin/env node

import getWebpackDllConfig from "./webpack.dll.config";

const program = require('commander')
const clc = require('cli-color')
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
import webpackDevServer from 'webpack-dev-server'

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

        if (config?.dll && !fs.existsSync(path.join(process.cwd(), ".dura", "vendor-manifest.json"))) {
            webpack(getWebpackDllConfig(config) ,function (err, stat) {
                console.log("dll compiler done")
                stat.toJson().errors.forEach(console.log)
                if (!err) {
                    new webpackDevServer(webpack(getWebpackConfig(config)), {
                            hot: true,
                            open: true,
                            watchOptions: {
                                aggregateTimeout: 300,
                                poll: 1000
                            },
                            stats: {
                                colors: true
                            }
                        }
                    ).listen(9999 , '127.0.0.1' , function(){

                    })
                }
            })
        } else {
            new webpackDevServer(webpack(getWebpackConfig(config)), {
                    hot: true,
                    open: true,
                    watchOptions: {
                        aggregateTimeout: 300,
                        poll: 1000
                    },
                    stats: {
                        colors: true
                    }
                }
            ).listen(9999 , '127.0.0.1' , function(){

            })
        }

    })

program
    .command('build')
    .description('build your app')
    .action(function (type, name) {
        console.log('build')
    })


program.parse(process.argv);