import UserModel from "@models/UserModel";

import { create, PlusDuraStore } from "@dura/plus";
import { createImmerPlugin } from "@dura/immer";
import { ExtractLoadingState } from "@dura/async-loading";
import { ExtractRootState } from "@dura/types";

const initialModel = {
  /**
   * 用户模块
   */
  user: UserModel
};

export type RootModel = typeof initialModel;

export type RootState = ExtractRootState<RootModel> & ExtractLoadingState<RootModel>;

export const store = create(initialModel, {
  plugins: [createImmerPlugin()]
}) as PlusDuraStore<RootModel>;

export const { reducerRunner, effectRunner } = store;
