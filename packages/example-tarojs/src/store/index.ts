import CountModel from "../models/CountModel";

import { create, PlusDuraStore } from "@dura/plus";
import { createImmerPlugin } from "@dura/immer";
import { ExtractLoadingState } from "@dura/async-loading";
import { ExtractRootState } from "@dura/types";

const initialModel = {
  count: CountModel
};

export type RootModel = typeof initialModel;

export type RootState = ExtractRootState<RootModel> & ExtractLoadingState<RootModel>;

export const store = create(initialModel, {
  plugins: [createImmerPlugin()]
}) as PlusDuraStore<RootModel>;

export const { reducerRunner, effectRunner } = store;
