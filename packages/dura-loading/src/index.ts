/**
 * 自动loading
 */
import { ModelMap, Model, EffectApi, ExcludeTypeAction, Plugin, EffectMap } from "@dura/types";

import _ from "lodash";

export const createLoadingModel = function(modelMap: ModelMap) {
  const initialState = _.entries(modelMap)
    .map(([modelName, model]) => ({
      [modelName]: _.keys(model.effects)
        .map((effectName: string) => ({ [effectName]: false }))
        .reduce(_.merge, {})
    }))
    .reduce(_.merge, {});
  type State = typeof initialState;
  type StartLoadingAction = {
    payload: {
      modelName: string;
      effectName: string;
    };
  };
  type EndLoadingAction = {
    payload: {
      modelName: string;
      effectName: string;
    };
  };
  return {
    state: initialState,
    reducers: {
      startLoading(state: State, action: StartLoadingAction) {
        return {
          ...state,
          [action.payload.modelName]: {
            [action.payload.effectName]: true
          }
        };
      },
      endLoading(state: State, action: EndLoadingAction) {
        return {
          ...state,
          [action.payload.modelName]: {
            [action.payload.effectName]: false
          }
        };
      }
    },
    effects: {}
  };
};

export const createLoadingPlugin = function<MM extends ModelMap>(modelMap: MM): Plugin {
  return {
    onEffect: (modelName, effectName, effect) => {
      return async (effectApi: EffectApi, action: ExcludeTypeAction) => {
        effectApi.dispatch({
          type: "loading/startLoading",
          payload: {
            modelName,
            effectName
          }
        });
        await effect(effectApi, action);
        effectApi.dispatch({
          type: "loading/endLoading",
          payload: {
            modelName,
            effectName
          }
        });
      };
    }
  };
};

type ConvertFnToBoolean<E extends EffectMap> = { [key in keyof E]: boolean };

export type ExtractLoadingState<RMT extends ModelMap> = {
  loading: { [key in keyof RMT]: ConvertFnToBoolean<RMT[key]["effects"]> };
};

export type LoadingMeta = {
  loading?: boolean;
};
