/**
 * 自动loading
 */
import { merge, noop } from "@dura/utils";
import { ModelMap, EffectMap, Plugin } from "@dura/plus";

export const createLoadingPlugin = function <MM extends ModelMap>(
  modelMap: MM
): Plugin {
  const initialState = Object.entries(modelMap)
    .map(([name, model]) => {
      return {
        [name]: Object.keys(model?.effects?.())
          .map((ename) => ({ [ename]: false }))
          .reduce(merge, noop()),
      };
    })
    .reduce(merge, {});

  type State = typeof initialState;

  return {
    wrapModel: (name, model) => {
      return {
        ...model,
        effects: (dispatch, getState, delay) =>
          Object.entries(model.effects(dispatch, getState, delay))
            .map(([k, v]) => ({
              [k]: async (payload, meta) => {
                const start = () =>
                    dispatch({
                      type: "loading/startLoading",
                      payload: {
                        modelName: name,
                        effectName: k,
                      },
                    }),
                  end = () =>
                    dispatch({
                      type: "loading/endLoading",
                      payload: {
                        modelName: name,
                        effectName: k,
                      },
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
              },
            }))
            .reduce(merge, {}),
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
                [payload.effectName]: true,
              },
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
                [payload.effectName]: false,
              },
            };
          },
        }),
        effects: () => ({}),
      },
    },
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
