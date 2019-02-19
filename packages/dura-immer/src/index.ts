import { Model } from "@dura/types";
import produce from "immer";

export const createImmerPlugin = function() {
  return {
    name: "immer",
    onWrapModel(name: string, model: Model) {
      const { reducers } = model;
      const nextReducers = Object.keys(reducers)
        .map((name: string) => ({
          [name]: (baseState, action) => produce(baseState, draftState => reducers[name](draftState, action))
        }))
        .reduce((prev, next) => ({ ...prev, ...next }), {});

      return {
        ...model,
        reducers: nextReducers
      };
    }
  };
};
