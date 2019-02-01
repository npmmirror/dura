/**
 * 自动loading
 */
import { RootModel, Effects, Model, EffectAPI } from "@dura/types";

export default {
  name: "loading",
  model: {
    state: {},
    reducers: {
      start(payload: { modelName: string; effectName: string }) {
        return function(state) {
          return {
            ...state,
            [payload.modelName]: {
              [payload.effectName]: true
            }
          };
        };
      },
      end(payload: { modelName: string; effectName: string }) {
        return function(state) {
          return {
            ...state,
            [payload.modelName]: {
              [payload.effectName]: false
            }
          };
        };
      }
    }
  },
  wrapModel: (name: string, model: Model) => {
    const { state, reducers, effects } = model;
    const nextEffects = Object.keys(effects)
      .map((key: string) => ({
        [key]: (payload?: any, meta?: any) => async (request: EffectAPI) => {
          request.dispatch({
            type: `loading/start`,
            payload: {
              modelName: name,
              effectName: key
            }
          });
          await effects[key](payload, meta)(request);
          request.dispatch({
            type: `loading/end`,
            payload: {
              modelName: name,
              effectName: key
            }
          });
          console.log("结束");
        }
      }))
      .reduce((prev, next) => ({ ...prev, ...next }), {});

    return {
      state,
      reducers,
      effects: nextEffects
    };
  }
};

type ConvertFnToBoolean<E extends Effects> = { [key in keyof E]: boolean };

export type ExtractLoadingState<RMT extends RootModel> = {
  loading: { [key in keyof RMT]: ConvertFnToBoolean<RMT[key]["effects"]> };
};

export type LoadingMeta = {
  loading: boolean;
};
