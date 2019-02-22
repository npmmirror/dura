import UserModel from "./models/UserModel";
import { create } from "@dura/plus";
import { createImmerPlugin } from "@dura/immer";
const initialModel = {
    /**
     * 用户模块
     */
    user: UserModel
};
export const store = create(initialModel, {
    plugins: [createImmerPlugin()]
});
export const { reducerRunner, effectRunner } = store;
