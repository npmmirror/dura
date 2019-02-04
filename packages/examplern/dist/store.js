import UserModel from "./models/UserModel";
import { create } from "@dura/core";
import { createAsyncPlugin } from "@dura/async";
import { createLoadingPlugin } from "@dura/async-loading";
import { createImmerPlugin } from "@dura/immer";
import { createSelectorsPlugin } from "@dura/selectors";
const initialModel = {
    /**
     * 用户模块
     */
    user: UserModel
};
export const store = create({
    initialModel,
    plugins: [createAsyncPlugin(), createLoadingPlugin(initialModel), createImmerPlugin(), createSelectorsPlugin()]
});
export const { reducerRunner, effectRunner, selectorRunner } = store;
