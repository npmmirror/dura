/**
 * 自动loading
 */
import { RootModel, Effects } from "@dura/types";

export default {
  name: "loading",
  model: {
    state: {},
    reducers: {
      onChangeLoading(state, action) {
        return {
          ...state,
          [action.payload.name]: {
            [action.payload.fnName]: action.payload.loading
          }
        };
      }
    }
  },
  wrapModel: model => model,
  intercept: {
    pre: action => action && action.meta && action.meta.loading,
    before: (action, dispatch) => {
      const [name, fnName] = action.type.split("/");
      dispatch({
        type: "loading/onChangeLoading",
        payload: {
          name,
          fnName,
          loading: true
        }
      });
    },
    after: (action, dispatch) => {
      const [name, fnName] = action.type.split("/");
      dispatch({
        type: "loading/onChangeLoading",
        payload: {
          name,
          fnName,
          loading: false
        }
      });
    }
  }
};

type ConvertFnToBoolean<E extends Effects> = { [key in keyof E]: boolean };

export type ExtractLoadingState<RMT extends RootModel> = {
  loading: { [key in keyof RMT]: ConvertFnToBoolean<RMT[key]["effects"]> };
};

export type LoadingMeta = {
  loading: boolean;
};
