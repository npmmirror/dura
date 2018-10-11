import path from "path";
import getBabelConfig from "./babel.config";
import webpack from "webpack";
import HtmlWebpackPlugin from 'html-webpack-plugin'
import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'

const {DefinePlugin, DllReferencePlugin, NamedModulesPlugin} = webpack;

function mapObjectValue(object, mapFn) {
    return Object.keys(object)
        .map(mapFn)
        .reduce((prev, next) => ({...prev, ...next}), {});
}

function getWebpackConfig({entry, outDir, extensions, alias, define, dll, html = true}) {

    const babelConfig = getBabelConfig({});

    let plugin = html ? [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            minify: {
                collapseWhitespace: true
            }
        }),
        new AddAssetHtmlPlugin({
            filepath: path.join(process.cwd(), '.dura', 'vendor.dll.js')
        })
    ] : []

    return {
        mode: "production",
        stats: "errors-only",
        entry: path.join(process.cwd(), entry),
        output: {
            filename: "app-[hash:8].js",
            path: path.join(process.cwd(), outDir)
        },
        resolve: {
            extensions: [...[".js", ".jsx", ".ts", ".tsx", ".json"], ...extensions],
            alias: {
                ...{},
                ...mapObjectValue(alias, key => ({
                    [key]: path.join(process.cwd(), alias[key])
                }))
            }
        },
        module: {
            rules: [
                {
                    test: /\.js|.jsx$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: "babel-loader",
                        options: babelConfig
                    }
                },
                {
                    test: /\.ts|.tsx?$/,
                    loader: "awesome-typescript-loader",
                    options: {
                        useBabel: true,
                        useCache: true,
                        babelCore: "@babel/core",
                        babelOptions: babelConfig
                    }
                }
            ]
        },
        plugins: [
            ...plugin,
            new NamedModulesPlugin(),
            new CleanWebpackPlugin([path.join(process.cwd(), outDir)]),
            new DefinePlugin({
                ...{},
                ...mapObjectValue(define, key => ({
                    [key]: JSON.stringify(define[key])
                }))
            }),
            new DllReferencePlugin({
                manifest: require(path.join(process.cwd(), ".dura/vendor-manifest.json"))
            })
        ]
    };
}

export default getWebpackConfig;
