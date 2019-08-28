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
export const store = create({
    initialModel: initialModel,
    compose: window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']
}, {
    immer: createImmerPlugin(),
    loading: createLoadingPlugin(initialModel)
});
const actionCreator = createAction(initialModel);
export { actionCreator };
