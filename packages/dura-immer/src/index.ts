import { Model } from "@dura/types";
import produce from "immer";

export default {
  name: "immer",
  wrapModel(model: Model) {
    const { state, reducers, effects } = model;

    const nextReducers = Object.keys(reducers)
      .map((name: string) => ({
        [name]: (baseState, action) => produce(baseState, draftState => reducers[name](draftState, action))
      }))
      .reduce((prev, next) => ({ ...prev, ...next }), {});

    return {
      state,
      effects,
      reducers: nextReducers
    };
  }
};
