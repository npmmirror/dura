/**
 * 自动loading
 */
import { ModelMap, EffectApi, ExcludeTypeAction, Plugin, EffectMap } from "@dura/types";
import _ from "lodash";

export const createLoadingPlugin = function<MM extends ModelMap>(modelMap: MM): Plugin {
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
    onEffect: (modelName, effectName, effect) => {
      return async (effectApi: EffectApi, action: ExcludeTypeAction) => {
        if (action.meta && action.meta.loading) {
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
        } else {
          await effect(effectApi, action);
        }
      };
    },
    extraModel: {
      loading: {
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
      }
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
