import CountModel from "../models/CountModel";

import { create, ExtractState } from "@dura/plus";
import { createImmerPlugin } from "@dura/immer";
import { ExtractLoadingState, createLoadingModel, createLoadingPlugin } from "@dura/loading";

const initialModel = {
  count: CountModel
};

export type RootModel = typeof initialModel;

export type RootState = ExtractState<RootModel> & ExtractLoadingState<RootModel>;

export const store = create(
  {
    initialModel: {
      ...initialModel,
      ...createLoadingModel(initialModel)
    }
  },
  [createImmerPlugin(), createLoadingPlugin(initialModel)]
);

export const { actionCreator } = store;
