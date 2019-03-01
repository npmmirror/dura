import UserModel from "@models/UserModel";

import { create, ExtractState } from "@dura/plus";
import { createImmerPlugin } from "@dura/immer";
import { createLoadingPlugin, ExtractLoadingState } from "@dura/loading";

const initialModel = {
  /**
   * 用户模块
   */
  user: UserModel
};

export type RootModel = typeof initialModel;

export type RootState = ExtractState<RootModel> & ExtractLoadingState<RootModel>;

export const store = create(
  { initialModel },
  {
    immer: createImmerPlugin(),
    loading: createLoadingPlugin(initialModel)
  }
);

export const { actionCreator } = store;
