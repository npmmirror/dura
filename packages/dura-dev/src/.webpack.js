export default {
    mode: 'production',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },
    module: {
        rules: [{
            test: /\.js(x)?$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader?cacheDirectory=true'
            }
        }, {
            test: /\.ts(x)?$/,
            loader: 'ts-loader'
        }]
    }
}