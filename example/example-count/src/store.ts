import { create, DuraStore, ExtractRootState } from "@dura/core";
import CountModel from "@models/CountModel";

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
