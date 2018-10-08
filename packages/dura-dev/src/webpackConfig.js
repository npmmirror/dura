import {getAbsPath} from './util'
import getResolve from './resolve'
import getModule from './module'
import getPlugins from './plugins'

export default function (userConfig) {

    const {entry, outDir} = userConfig


    return ({
        mode: 'production',
        entry: getAbsPath(entry),
        stats: "errors-only",
        output: {
            filename: 'bundle-[hash:8].js',
            path: getAbsPath(outDir)
        },
        resolve: getResolve(userConfig),
        module: getModule(userConfig),
        plugins: getPlugins(userConfig)
    })

}