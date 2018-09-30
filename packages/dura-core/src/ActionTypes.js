const randomString = () =>
    Math.random()
        .toString(36)
        .substring(7)
        .split('')
        .join('.')


const ActionTypes = {
    CANCEL: `@@duraCore/cancel${randomString()}`,
    PLUS_COUNT: `@@duraCore/reducers/plusCount${randomString()}`,
}

export default ActionTypes
