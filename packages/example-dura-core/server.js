const path = require("path");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

const {
    HotModuleReplacementPlugin,
    NamedModulesPlugin,
    DllReferencePlugin,
    DllPlugin
} = webpack;

const dll = webpack({
    entry: {
        vendor: ["react"]
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: '[name].js',
        library: '[name]'
    },
    plugins: [
        new DllPlugin({
            path: path.join(__dirname, 'dist', '[name]-manifest.json'),
            name: '[name]'
        })
    ]
})


dll.run((err) => {
    console.log("dll:", err)
    if (!err) {
        const compiler = webpack({
            mode: "production",
            entry: path.resolve(__dirname, "src/index.tsx"),
            output: {
                filename: "bundle-[hash:8].js",
                path: path.resolve(__dirname, "dist")
            },
            resolve: {
                extensions: ['.ts', '.tsx', '.js', '.jsx']
            },
            module: {
                rules: [{
                    test: /\.ts|.tsx?$/,
                    loader: 'awesome-typescript-loader',
                    options: {
                        useBabel: true,
                        babelCore: "@babel/core",
                        babelOptions: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        targets: "> 0.25%, not dead"
                                    }
                                ]
                            ],
                            plugins: [
                                "@babel/plugin-transform-react-jsx",
                                [
                                    "@babel/plugin-transform-runtime",
                                    {
                                        corejs: false,
                                        helpers: false,
                                        regenerator: true,
                                        useESModules: false
                                    }
                                ]
                            ]
                        }
                    }
                }, {
                    test: /\.js|.jsx$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        targets: "> 0.25%, not dead"
                                    }
                                ]
                            ],
                            plugins: [
                                "@babel/plugin-transform-react-jsx",
                                [
                                    "@babel/plugin-transform-runtime",
                                    {
                                        corejs: false,
                                        helpers: false,
                                        regenerator: true,
                                        useESModules: false
                                    }
                                ]
                            ]
                        }
                    }
                }]
            },
            plugins: [
                new HtmlWebpackPlugin({
                    filename: "index.html",
                    template: path.resolve(__dirname, "public/index.html")
                }),
                new HotModuleReplacementPlugin(),
                new NamedModulesPlugin(),
                new DllReferencePlugin({
                    manifest: require('./dist/vendor-manifest.json'),
                }),
                new AddAssetHtmlPlugin({
                    filepath: path.join(__dirname, './dist/vendor.js')
                })
            ]
        });
        //
        //
        compiler.run((err, stats) => {
            console.log("compiler", err)
            // console.log(stats)
        })



        // const server = new webpackDevServer(compiler, {
        //     hot: true,
        //     open: true,
        //     watchOptions: {
        //         aggregateTimeout: 300,
        //         poll: 1000
        //     },
        //     stats: {
        //         colors: true
        //     }
        // });
        //
        // server.listen(9999, "127.0.0.1", function () {
        // });

    }
})

