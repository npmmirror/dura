import {getAbsPath} from '../util'

const defaultAlias = {}

export default function (userAlias) {
    const alias = ({...defaultAlias, ...userAlias})
    return Object
        .keys(alias)
        .map(
            k => ({[k]: getAbsPath(alias[k])})
        )
        .reduce(
            (prev, next) => ({...prev, ...next}),
            {}
        )
}