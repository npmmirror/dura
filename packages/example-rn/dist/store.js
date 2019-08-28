import UserModel from './models/UserModel';
import RouterModel from './models/RouterModel';
import { create } from '@dura/plus';
import { createImmerPlugin } from '@dura/immer';
import { createLoadingPlugin } from '@dura/loading';
import createAction from '@dura/actions';
const initialModel = {
    /**
     * 用户模块1
     */
    user: UserModel,
    router: RouterModel
};
console.log(window['devToolsExtension']({
    'user/onChangeContext': () => ({
        type: 'user/onChangeContext',
        payload: { newContext: '1' }
    })
}));
let error = [];
export const store = create({
    initialModel: initialModel,
    compose: window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'],
    middlewares: [
        store => next => action => {
            error.push(action);
            try {
                next(action);
            }
            catch (e) {
                console.log(JSON.stringify(error));
                next(action);
            }
            console.log(JSON.stringify(error));
        }
    ]
}, {
    immer: createImmerPlugin(),
    loading: createLoadingPlugin(initialModel)
});
const actionCreator = createAction(initialModel);
[
    { type: 'user/onChangeContext', payload: { newContext: '1' } },
    { type: 'user/onChangeContext', payload: { newContext: '11' } },
    { type: 'user/onChangeContext', payload: { newContext: '112' } },
    { type: 'user/onChangeContext', payload: { newContext: '1123' } },
    { type: 'user/onChangeContext', payload: { newContext: '11234' } },
    {
        type: 'user/onAsyncChangeName',
        payload: { newName: 'async异步张三3' },
        meta: { loading: true }
    },
    {
        type: 'loading/startLoading',
        payload: { modelName: 'user', effectName: 'onAsyncChangeName' }
    },
    {
        type: 'loading/endLoading',
        payload: { modelName: 'user', effectName: 'onAsyncChangeName' }
    }
].forEach(action => {
    store.dispatch(action);
});
export { actionCreator };
