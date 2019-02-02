import UserModel from "../models/UserModel";

import { create } from "@dura/core";
import { createAsyncPlugin, AsyncDuraStore } from "@dura/async";
import { createLoadingPlugin, ExtractLoadingState } from "@dura/async-loading";
import immerPlugin from "@dura/immer";
import { createSelectorsPlugin, SelectorsDuraStore } from "@dura/selectors";
import { DuraStore, ExtractRootState } from "@dura/types";

const initialModel = {
  user: UserModel
};

export type RootModel = typeof initialModel;

export type RootState = ExtractRootState<RootModel> & ExtractLoadingState<RootModel>;

export const store = create({
  initialModel,
  plugins: [createAsyncPlugin(), createLoadingPlugin(initialModel), immerPlugin, createSelectorsPlugin()]
}) as DuraStore<RootModel> & AsyncDuraStore<RootModel> & SelectorsDuraStore<RootModel>;

export const { reducerRunner, effectRunner, selectorRunner } = store;
