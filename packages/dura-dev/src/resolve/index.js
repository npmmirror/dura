import getExtensions from './extensions'
import getAlias from './alias'


export default function (userConfig) {

    const {
        extensions = [],
        alias = {}
    } = userConfig

    return ({
        extensions: getExtensions(extensions),
        alias: getAlias(alias)
    })

}
