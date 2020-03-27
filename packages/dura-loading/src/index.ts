/**
 * 自动loading
 */
import { ModelMap, Plugin, EffectMap } from "@dura/types";
import entries from "lodash/entries";
import keys from "lodash/keys";
import merge from "lodash/merge";
import get from "lodash/get";

export const createLoadingPlugin = function<MM extends ModelMap>(
  modelMap: MM
): Plugin {
  const initialState = entries(modelMap)
    .map(([name, model]) => {
      return {
        [name]: keys(get(model, "effects", () => ({}))())
          .map(ename => ({ [ename]: false }))
          .reduce(merge, {})
      };
    })
    .reduce(merge, {});

  type State = typeof initialState;

  return {
    wrapModel: (name, model) => {
      return {
        ...model,
        effects: (dispatch, getState, delay) =>
          entries(model.effects(dispatch, getState, delay))
            .map(([k, v]) => ({
              [k]: async (payload, meta) => {
                const start = () =>
                    dispatch({
                      type: "loading/startLoading",
                      payload: {
                        modelName: name,
                        effectName: k
                      }
                    }),
                  end = () =>
                    dispatch({
                      type: "loading/endLoading",
                      payload: {
                        modelName: name,
                        effectName: k
                      }
                    });

                if (meta && meta.loading) {
                  try {
                    start();
                    await v(payload, meta);
                    end();
                  } catch (error) {
                    end();
                    throw error;
                  }
                } else {
                  await v(payload, meta);
                }
              }
            }))
            .reduce(merge, {})
      };
    },
    extraModel: {
      loading: {
        state: () => initialState,
        reducers: () => ({
          startLoading(
            state: State,
            payload: {
              modelName: string;
              effectName: string;
            }
          ) {
            return {
              ...state,
              [payload.modelName]: {
                [payload.effectName]: true
              }
            };
          },
          endLoading(
            state: State,
            payload: {
              modelName: string;
              effectName: string;
            }
          ) {
            return {
              ...state,
              [payload.modelName]: {
                [payload.effectName]: false
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
    [key in keyof RMT]: ConvertFnToBoolean<ReturnType<RMT[key]["effects"]>>;
  };
};

export type LoadingMeta = {
  loading?: boolean;
};
