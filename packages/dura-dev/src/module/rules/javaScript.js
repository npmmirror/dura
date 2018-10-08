import {babelConfig} from '../../config'

export default {
    test: /\.js|.jsx$/,
    exclude: /(node_modules|bower_components)/,
    use: {
        loader: "babel-loader",
        options: babelConfig
    }
}