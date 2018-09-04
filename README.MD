

alpha


import {createDuraCore} from 'dura-core/lib'

const duraStore = createDuraCore()

duraStore.start()

const modelA = {
    namespace: 'am',
    initialState: {
        name: 'a'
    }
}, modelB = {
    namespace: 'bm',
    initialState: {
        name: 'b'
    }
}, modelC = {
    namespace: 'cm',
    initialState: {
        name: 'c'
    }
}

duraStore.addModel(modelB, modelC)

duraStore.restart();