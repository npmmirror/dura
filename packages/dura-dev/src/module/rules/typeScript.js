import {babelConfig} from '../../config'

export default {
    test: /\.ts|.tsx?$/,
    loader: 'awesome-typescript-loader',
    options: {
        useBabel: true,
        useCache: true,
        babelCore: "@babel/core",
        babelOptions: babelConfig
    }
}