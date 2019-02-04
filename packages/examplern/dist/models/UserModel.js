import * as tslib_1 from "tslib";
import { reducerRunner } from "../store";
import { createSelector } from "reselect";
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
        onChangeName(payload) {
            return function (state) {
                state.name = payload.newName;
                return state;
            };
        }
    },
    effects: {
        /**
         * 异步修改姓名
         * @param payload
         */
        onAsyncChangeName(payload, meta) {
            return function (effectApi) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    yield effectApi.delay(2000);
                    reducerRunner.user.onChangeName(payload);
                });
            };
        }
    },
    selectors: {
        chinaName() {
            return createSelector((state) => state.user.name, name => `【${name}】`);
        }
    }
};
