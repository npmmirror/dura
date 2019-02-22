import UserModel from "@models/UserModel";

import { create, PlusDuraStore , PlusRootState } from "@dura/plus";
import { createImmerPlugin } from "@dura/immer";

const initialModel = {
  /**
   * 用户模块
   */
  user: UserModel
};

export type RootModel = typeof initialModel;

export type RootState = PlusRootState<RootModel>;

export const store = create(initialModel, {
  plugins: [createImmerPlugin()]
}) as PlusDuraStore<RootModel>;

export const { reducerRunner, effectRunner } = store;
