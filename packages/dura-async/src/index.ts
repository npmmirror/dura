import {IPlugin , IModel} from 'dura-core/src/typings'

function createAsyncEffects(): IPlugin {


    return {
        self: {
            gEffects: {}
        },
        onModel(model:IModel) {
            
        },
        middleware(store) {
            return next => action => {

            }
        }
    }
}