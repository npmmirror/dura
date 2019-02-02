import CountModel from "@models/CountModel";

import { create } from "@dura/core";

import { DuraStore, ExtractRootState } from "@dura/types";

const initialModel = {
  /**
   * 用户模块
   */
  count: CountModel
};

export type RootModel = typeof initialModel;
export type RootState = ExtractRootState<RootModel>;

export const store = create({
  initialModel
}) as DuraStore<RootModel>;

export const { reducerRunner } = store;
