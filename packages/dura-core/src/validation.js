import invariant from 'invariant'

const modelSign = '[dura.core.model]'

function validateModel(model, modelList) {

    const {namespace} = model

    //必须有namespace
    invariant(namespace, `${modelSign} namespace should be defined`)

    //必须是string类型
    invariant(typeof namespace === 'string', `${modelSign} namespace should be string`)

    //必须唯一
    invariant(!modelList.some(m => namespace === m.namespace), `${modelSign} namespace should be unique , the repeated namespace is ${namespace}`)

}


export {
    validateModel
}