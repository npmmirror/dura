import { Model } from "@dura/types";
import produce from "immer";

export default {
  name: "immer",
  wrapModel(name: string, model: Model) {
    const { state, reducers, effects } = model;

    const nextReducers = Object.keys(reducers)
      .map((name: string) => ({
        [name]: (payload?: any, meta?: any) => (baseState: any) =>
          produce(baseState, draftState => reducers[name](payload, meta)(draftState))
      }))
      .reduce((prev, next) => ({ ...prev, ...next }), {});

    return {
      state,
      effects,
      reducers: nextReducers
    };
  }
};
