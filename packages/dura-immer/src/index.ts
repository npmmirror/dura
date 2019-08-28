import { Plugin } from "@dura/types";
import produce from "immer";

export const createImmerPlugin = function(): Plugin {
  return {
    onReducer(modelName, reducerName, reducer) {
      return (baseState, action) => produce(baseState, draftState => reducer(draftState, action.payload,action.meta));
    }
  };
};
