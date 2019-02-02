import UserModel from "@models/UserModel";

import { create, DuraStore, ExtractRootState } from "@dura/core";
import { createAsyncPlugin, AsyncDuraStore } from "@dura/async";
import { createLoadingPlugin, ExtractLoadingState } from "@dura/async-loading";
import { createImmerPlugin } from "@dura/immer";
import { createSelectorsPlugin, SelectorsDuraStore } from "@dura/selectors";

const initialModel = {
  /**
   * 用户模块
   */
  user: UserModel
};

export type RootModel = typeof initialModel;

export type RootState = ExtractRootState<RootModel> & ExtractLoadingState<RootModel>;

export const store = create({
  initialModel,
  plugins: [createAsyncPlugin(), createLoadingPlugin(initialModel), createImmerPlugin(), createSelectorsPlugin()]
}) as DuraStore<RootModel> & AsyncDuraStore<RootModel> & SelectorsDuraStore<RootModel>;

export const { reducerRunner, effectRunner, selectorRunner } = store;
