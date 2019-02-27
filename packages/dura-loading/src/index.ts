/**
 * 自动loading
 */
import { ModelMap, Model, EffectApi, ExcludeTypeAction, Plugin, EffectMap } from "@dura/types";

import _ from "lodash";

export const createLoading = function<MM extends ModelMap>(modelMap: MM): Plugin {
  const initialState = _.keys(modelMap)
    .map((modelName: string) => ({
      [modelName]: extractLoadingModelInitialStateByEffect(modelMap[modelName])
    }))
    .reduce(_.merge, {});

  return {
    extraModels: {
      loading: {
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
        },
        effects: {}
      }
    },
    onModel: (name, model) => {
      const { effects = {} } = model;

      const start = (effectName: string) => ({ type: `loading/start`, payload: { modelName: name, effectName } });

      const end = (effectName: string) => ({ type: `loading/end`, payload: { modelName: name, effectName } });

      const nextEffects = _.keys(effects)
        .map((key: string) => ({
          [key]: async (request: EffectApi, action: ExcludeTypeAction) => {
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

function extractLoadingModelInitialStateByEffect<S extends Model<any>>(
  model: S
): { [k in keyof S["effects"]]: boolean } {
  return _.keys(model.effects || {})
    .map((effectName: string) => ({ [effectName]: false }))
    .reduce(_.merge, {});
}

type ConvertFnToBoolean<E extends EffectMap> = { [key in keyof E]: boolean };

export type ExtractLoadingState<RMT extends ModelMap> = {
  loading: { [key in keyof RMT]: ConvertFnToBoolean<RMT[key]["effects"]> };
};

export type LoadingMeta = {
  loading?: boolean;
};
