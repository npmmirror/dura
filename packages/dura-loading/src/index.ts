/**
 * 自动loading
 */
import {
  ModelMap,
  EffectApi,
  ExcludeTypeAction,
  Plugin,
  EffectMap
} from '@dura/types';
import entries from 'lodash/entries';
import keys from 'lodash/keys';
import merge from 'lodash/merge';

export const createLoadingPlugin = function<MM extends ModelMap>(
  modelMap: MM
): Plugin {
  const initialState = entries(modelMap)
    .map(([modelName, model]) => ({
      [modelName]: keys(model.effects)
        .map((effectName: string) => ({ [effectName]: false }))
        .reduce(merge, {})
    }))
    .reduce(merge, {});
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
        const start = () =>
            effectApi.dispatch({
              type: 'loading/startLoading',
              payload: {
                modelName,
                effectName
              }
            }),
          end = () =>
            effectApi.dispatch({
              type: 'loading/endLoading',
              payload: {
                modelName,
                effectName
              }
            });

        if (action.meta && action.meta.loading) {
          try {
            start();
            await effect(effectApi, action);
            end();
          } catch (error) {
            end();
            throw error;
          }
        } else {
          await effect(effectApi, action);
        }
      };
    },
    extraModel: {
      loading: {
        state: () => initialState,
        reducers: () => ({
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
        }),
        effects: () => ({})
      }
    }
  };
};

type ConvertFnToBoolean<E extends EffectMap> = { [key in keyof E]: boolean };

export type ExtractLoadingState<RMT extends ModelMap> = {
  loading: {
    [key in keyof RMT]: ConvertFnToBoolean<ReturnType<RMT[key]['effects']>>;
  };
};

export type LoadingMeta = {
  loading?: boolean;
};
