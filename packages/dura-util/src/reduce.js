export function objectReduce(prev, next) {
    return ({...prev, ...next})
}

export function arrayReduce(prev, next) {
    return ([...prev, ...next])
}