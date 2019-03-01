import UserModel from "./models/UserModel";
import { create } from "@dura/plus";
import { createImmerPlugin } from "@dura/immer";
import { createLoadingModel, createLoadingPlugin } from "@dura/loading";
const initialModel = {
    /**
     * 用户模块
     */
    user: UserModel
};
export const store = create({
    initialModel: Object.assign({}, initialModel, createLoadingModel(initialModel))
}, [createImmerPlugin(), createLoadingPlugin(initialModel)]);
export const { actionCreator } = store;
