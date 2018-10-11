import path from 'path'
import getBabelConfig from './babel.config'
import webpack from 'webpack'

const {DefinePlugin} = webpack

function mapObjectValue(object, mapFn) {
    return Object.keys(object).map(mapFn).reduce((prev, next) => ({...prev, ...next}), {})
}


function getWebpackConfig({
                              entry,
                              outDir,
                              extensions,
                              alias,
                              define
                          }) {

    const babelConfig = getBabelConfig({})

    return ({
        mode: 'production',
        stats: "errors-only",
        entry: path.join(process.cwd(), entry),
        output: {
            filename: 'bundle-[hash:8].js',
            path: path.join(process.cwd(), outDir)
        },
        resolve: {
            extensions: [
                ...['.js', '.jsx', '.ts', '.tsx', '.json'],
                ...extensions
            ],
            alias: {
                ...{},
                ...mapObjectValue(alias, key => ({[key]: path.join(process.cwd(), alias[key])}))
            }
        },
        module: {
            rules: [{
                test: /\.js|.jsx$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: babelConfig
                }
            }, {
                test: /\.ts|.tsx?$/,
                loader: 'awesome-typescript-loader',
                options: {
                    useBabel: true,
                    useCache: true,
                    babelCore: "@babel/core",
                    babelOptions: babelConfig
                }
            }]
        },
        plugins: [
            new DefinePlugin({
                ...{},
                ...mapObjectValue(define, key => ({[key]: JSON.stringify(define[key])}))
            })
        ]
    })
}


export default getWebpackConfig