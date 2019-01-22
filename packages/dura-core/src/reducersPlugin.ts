import {IModel, IPlugin} from "./typings";

function createReducersPlugin(): IPlugin {
    return {
        self: {
            reducers: {}
        },
        onModel(model: IModel) {
            model.reducers = {
                ...model.reducers,
                clear(state) {
                    return state;
                }
            }
            return model;
        }
    };
}

export default createReducersPlugin;
