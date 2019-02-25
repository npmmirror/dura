/**
 * 自动loading
 */
import { RootModel, Model, EffectAPI, ExcludeTypeAction, EffectMap } from "@dura/types";

import _ from "lodash";

function extractLoadingModelInitialStateByEffect<S extends Model<any>>(
  model: S
): { [k in keyof S["effects"]]: boolean } {
  return _.keys(model.effects || {})
    .map((effectName: string) => ({ [effectName]: false }))
    .reduce(_.merge, {});
}

export const createLoadingPlugin = function(rootModel: RootModel) {
  const initialState = _.keys(rootModel)
    .map((modelName: string) => ({
      [modelName]: extractLoadingModelInitialStateByEffect(rootModel[modelName])
    }))
    .reduce(_.merge, {});

  return {
    name: "loading",
    model: {
      state: initialState,
      reducers: {
        start(state, action: { payload: { modelName: string; effectName: string } }) {
          return {
            ...state,
            [action.payload.modelName]: {
              [action.payload.effectName]: true
            }
          };
        },
        end(state, action: { payload: { modelName: string; effectName: string } }) {
          return {
            ...state,
            [action.payload.modelName]: {
              [action.payload.effectName]: false
            }
          };
        }
      }
    },
    onWrapModel: (name: string, model: Model<any>) => {
      if (name === "loading") {
        return model;
      }

      const { effects = {} } = model;

      const start = (effectName: string) => ({ type: `loading/start`, payload: { modelName: name, effectName } });

      const end = (effectName: string) => ({ type: `loading/end`, payload: { modelName: name, effectName } });

      const nextEffects = Object.keys(effects)
        .map((key: string) => ({
          [key]: async (request: EffectAPI, action: ExcludeTypeAction) => {
            //兼容
            if (action && action.meta && action.meta.loading) {
              request.dispatch(start(key));
              await effects[key](request, action);
              request.dispatch(end(key));
            } else {
              await effects[key](request, action);
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

type ConvertFnToBoolean<E extends EffectMap> = { [key in keyof E]: boolean };

export type ExtractLoadingState<RMT extends RootModel> = {
  loading: { [key in keyof RMT]: ConvertFnToBoolean<RMT[key]["effects"]> };
};

export type LoadingMeta = {
  loading?: boolean;
};
