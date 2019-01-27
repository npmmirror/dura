import {
  create,
  actionCreator,
  DuraRootState,
  DuraDispatch,
  DuraEffectRequest,
  IPlugin,
  DuraRootEffects,
  IModel
} from "../src/index";
import { createAction } from "redux-actions";

describe("dds", function() {
  it("dd", function() {
    const user = {
      state: {
        name: undefined,
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
        async onAsyncChangeName(request: DuraEffectRequest<{ name: string }>) {
          actionCreator.user.onChangeName(request.action.payload);
        }
      }
    };

    const loadPlugin: IPlugin = {
      self: {
        loading: {
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
        }
      },
      name(): string {
        return "loading";
      },
      addModel(): IModel {
        return this.loading;
      },
      wrapModel(model: IModel, name: string): IModel {
        if (name === "loading") {
          return model;
        }
        const { effects = {} } = model;
        const modelState = Object.keys(effects)
          .map((key: string) => ({ [key]: false }))
          .reduce((prev, next) => ({ ...prev, ...next }), {});
        this.loading.state = { ...this.loading.state, [name]: modelState };
        return model;
      },
      isInterceptEffect(action) {
        return action["meta"].loading;
      },
      effectBefore(action) {
        const ac: DuraDispatch<typeof initialModel> = actionCreator;
        actionCreator.loading.onChangeLoading({
          name: action.type.split("/")[0],
          fnName: action.type.split("/")[1],
          loading: true
        });
      },
      effectAfter(action) {
        const ac: DuraDispatch<typeof initialModel> = actionCreator;
        actionCreator.loading.onChangeLoading({
          name: action.type.split("/")[0],
          fnName: action.type.split("/")[1],
          loading: false
        });
      }
    };

    const initialModel = {
      user: user,
      test: {
        state: {
          test: "xx"
        },
        effects: {
          onAsyncTestFunc() {}
        }
      }
    };

    const store = create({
      initialModel,
      plugins: [loadPlugin]
    });

    let state = store.getState() as DuraRootState<typeof initialModel> & {
      loading: DuraRootEffects<typeof initialModel>;
    };

    const ac: DuraDispatch<typeof initialModel> = actionCreator;

    ac.user.onAsyncChangeName({ name: "章三" }, { loading: true });


    console.log(state["loading"]);
    console.log(state.loading.user.onAsyncChangeName);
  });
});
