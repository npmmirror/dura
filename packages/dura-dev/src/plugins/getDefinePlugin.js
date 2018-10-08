import webpack from 'webpack'

const defaultDefine = {}

export default function (userConfig) {

    const {DefinePlugin} = webpack

    const {define} = userConfig

    const newDefine = {...defaultDefine, ...define};

    return new DefinePlugin(
        Object
            .keys(newDefine)
            .map(k => ({[k]: JSON.stringify(newDefine[k])}))
            .reduce((prev, next) => ({...prev, ...next}), {})
    )

}