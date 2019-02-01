/**
 * 自动loading
 */
import { RootModel, Effects, Model, EffectAPI, Meta } from "@dura/types";

export const createLoadingPlugin = function(rootModel: RootModel) {
  const extractEffect = (model: Model) =>
    Object.keys(model.effects || {})
      .map((effectName: string) => ({ [effectName]: false }))
      .reduce((prev, next) => ({ ...prev, ...next }), {});
  const state = Object.keys(rootModel)
    .map((modelName: string) => ({
      [modelName]: extractEffect(rootModel[modelName])
    }))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
  return {
    name: "loading",
    model: {
      state,
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
      if (name === "loading") {
        return model;
      }
      const { state, reducers, effects = {} } = model;

      const start = (effectName: string) => ({ type: `loading/start`, payload: { modelName: name, effectName } });

      const end = (effectName: string) => ({ type: `loading/end`, payload: { modelName: name, effectName } });

      const nextEffects = Object.keys(effects)
        .map((key: string) => ({
          [key]: (payload?: any, meta?: LoadingMeta & Meta) => async (request: EffectAPI) => {
            const effectFn = async () => await effects[key](payload, meta)(request);
            const loadingHoc = async effectFn => {
              request.dispatch(start(key));
              await effectFn();
              request.dispatch(end(key));
            };

            if (meta.loading) {
              loadingHoc(effectFn);
            } else {
              await effectFn();
            }
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
};

type ConvertFnToBoolean<E extends Effects> = { [key in keyof E]: boolean };

export type ExtractLoadingState<RMT extends RootModel> = {
  loading: { [key in keyof RMT]: ConvertFnToBoolean<RMT[key]["effects"]> };
};

export type LoadingMeta = {
  loading: boolean;
};
