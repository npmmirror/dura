import UserModel from "@models/UserModel";

import { createImmerPlugin } from "@dura/immer";
import { createLoadingPlugin, ExtractLoadingState } from "@dura/loading";
import HelloModel from "./container/Home/models/HelloModel";
import { create } from "@dura/plus";
import { ExtractState } from "@dura/core";
import { createActions } from "@dura/actions";

const initialModel = {
  /**
   * 用户模块
   */
  user: UserModel,
  /**
   * hello 模块， 主要处理一些乱七八糟的问题
   */
  hello: HelloModel,
};

export type RootModel = typeof initialModel;

export type RootState = ExtractLoadingState<RootModel> &
  ExtractState<RootModel>;

export const store = create(
  {
    initialModel: initialModel,
    compose: window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"],
  },
  {
    immer: createImmerPlugin(),
    loading: createLoadingPlugin(initialModel),
  }
);

export const actionCreator = createActions(initialModel);
