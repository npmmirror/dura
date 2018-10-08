import getRules from './rules'

export default function (userConfig) {
    return ({
        rules: getRules(userConfig)
    })
}