import { create } from "../src/index";
import {
  ExtractRootState,
  RequestForEffect,
  Plugin,
  ExtractRootEffects,
  ExtractDispatch,
  Model,
  RootModel
} from "@dura/types";

describe("dds", function() {
  it("dd", function() {
    const user = {
      state: {
        /**
         * 姓名11
         */
        name: undefined,
        /**
         * 性别
         */
        sex: undefined
      },
      reducers: {
        onChangeName(state: any, action: any): any {
          state.name = action.payload.name;
          return { ...state, ...action.payload };
        }
      },
      effects: {
        /**
         * 异步获取用户信息
         * @param param0
         */
        async onAsyncChangeName(request: RequestForEffect<{ name: string }, {}>) {
          const dispatch = request.dispatch as Dispatch,
            action = request.action,
            rootState = request.getState() as RootState;

          dispatch.user.onChangeName(action.payload);
        }
      }
    };

    const loadPlugin: Plugin<any> = {
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
      wrapModel: (model: Model<any>) => model,
      intercept: {
        pre: action => action && action.meta && action.meta.loading,
        before: (action, dispatch) => {
          const [name, fnName] = action.type.split("/");
          dispatch.loading.onChangeLoading({ name, fnName, loading: true });
        },
        after: (action, dispatch) => {
          const [name, fnName] = action.type.split("/");
          dispatch.loading.onChangeLoading({ name, fnName, loading: false });
        }
      }
    };

    const initialModel = {
      /**
       * 用户模块
       */
      user: user,
      /**
       * 测试模块
       */
      test: {
        state: {
          test: "xx"
        },
        effects: {
          onAsyncTestFunc() {}
        }
      }
    };

    type ExtractLoadingState<RMT extends RootModel> = {
      loading: ExtractRootEffects<RMT>;
    };

    type Dispatch = ExtractDispatch<typeof initialModel>;
    type RootState = ExtractRootState<typeof initialModel> & ExtractLoadingState<typeof initialModel>;

    const store = create({
      initialModel,
      plugins: [loadPlugin]
    });

    console.log(store.dispatch);

    let state = store.getState() as RootState;

    const ac = store.dispatch as Dispatch;

    ac.user.onAsyncChangeName({ name: "章三" }, { loading: true });

    ac.user.onAsyncChangeName();

    // console.log(state.loading.user.onAsyncChangeName);
  });
});
