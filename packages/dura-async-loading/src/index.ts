/**
 * 自动loading
 */
import { RootModel, Model, Meta, Payload } from "@dura/types";
import { EffectAPI, Effects, AsyncModel } from "@dura/async";

export const createLoadingPlugin = function(rootModel: RootModel) {
  const extractEffect = (model: Model & AsyncModel) =>
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
    onWrapModel: (name: string, model: Model & AsyncModel) => {
      if (name === "loading") {
        return model;
      }

      const { effects = {} } = model;

      const start = (effectName: string) => ({ type: `loading/start`, payload: { modelName: name, effectName } });

      const end = (effectName: string) => ({ type: `loading/end`, payload: { modelName: name, effectName } });

      const nextEffects = Object.keys(effects || {})
        .map((key: string) => ({
          [key]: (payload?: Payload, meta?: Meta & LoadingMeta) => async (request: EffectAPI) => {
            const effectFn = async () => await effects[key](payload, meta)(request);
            const loadingHoc = async effectFn => {
              request.dispatch(start(key));
              await effectFn();
              request.dispatch(end(key));
            };

            //兼容
            if ((meta || { loading: false }).loading) {
              loadingHoc(effectFn);
            } else {
              await effectFn();
            }
          }
        }))
        .reduce((prev, next) => ({ ...prev, ...next }), {});

      return {
        ...model,
        effects: nextEffects
      };
    }
  };
};

type ConvertFnToBoolean<E extends Effects> = { [key in keyof E]: boolean };

export type ExtractLoadingState<RMT extends RootModel<Model & AsyncModel>> = {
  loading: { [key in keyof RMT]: ConvertFnToBoolean<RMT[key]["effects"]> };
};

export type LoadingMeta = {
  loading: boolean;
};
