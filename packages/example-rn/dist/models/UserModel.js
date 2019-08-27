import * as tslib_1 from "tslib";
import { actionCreator } from '../store';
const initialState = {
    /**
     * 姓名
     */
    name: '默认姓名',
    /**
     * 性别
     */
    sex: undefined,
    /**
     * 年龄
     */
    age: undefined,
    /**
     * 文本内容
     */
    context: ''
};
export default {
    state: initialState,
    reducers: {
        /**
         *
         * @param payload 同步修改姓名
         */
        onChangeName(state, action) {
            state.name = action.payload.newName;
            return state;
        },
        onChangeContext(state, action) {
            state.context = action.payload.newContext;
            return state;
        }
    },
    effects: {
        /**
         * 异步修改姓名
         * @param payload
         */
        onAsyncChangeName(effectApi, action) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield effectApi.delay(2000);
                effectApi.dispatch(actionCreator.user.onChangeName(action.payload));
            });
        }
    }
};
