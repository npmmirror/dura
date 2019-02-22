import * as tslib_1 from "tslib";
import { reducerRunner } from "../store";
const initialState = {
    /**
     * 姓名
     */
    name: "默认姓名",
    /**
     * 性别
     */
    sex: undefined,
    /**
     * 年龄
     */
    age: undefined
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
        }
    },
    effects: {
        /**
         * 异步修改姓名
         * @param payload
         */
        onAsyncChangeName(action, effectApi) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield effectApi.delay(2000);
                reducerRunner.user.onChangeName(action.payload);
            });
        }
    }
};
