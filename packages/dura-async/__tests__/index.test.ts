import { create, ExtractRootState } from "@dura/core";
import { DuraStore } from "@dura/types";
import { createAsyncPlugin, AsyncDuraStore, EffectAPI } from "../src/index";

describe("单元测试", function() {
  it("测试effects", function(done) {
    const initialState = {
      name: "默认",
      sex: undefined
    };

    type IState = typeof initialState;

    const createUser = function() {
      const user = {
        state: initialState,
        reducers: {
          /**
           * 修改用户姓名
           * @param payload
           */
          onChangeName(state: IState, action: { payload: { name: string } }) {
            return { ...state, ...action.payload };
          }
        },
        effects: {
          /**
           * 异步的修改用户姓名
           * @param payload
           */
          async onAsyncChangeName(action: { payload: { name: string } }, request: EffectAPI) {
            await request.delay(1500);
            const oldName = request.select((state: RootState) => state.user.name);
            reducerRunner.user.onChangeName({ name: oldName });
          }
        }
      };
      return user;
    };

    const initModel = {
      user: createUser(),
      x: {
        state: {}
      }
    };

    type RootState = ExtractRootState<typeof initModel>;

    const store = create({
      initialModel: initModel,
      plugins: [createAsyncPlugin()]
    }) as DuraStore<typeof initModel> & AsyncDuraStore<typeof initModel>;

    const reducerRunner = store.reducerRunner;
    const effectRunner = store.effectRunner;

    expect(store.getState().user).toEqual(initialState);

    reducerRunner.user.onChangeName({ name: "张三" });

    expect(store.getState().user.name).toEqual("张三");

    effectRunner.user.onAsyncChangeName({ name: "李四" });

    setTimeout(() => {
      expect(store.getState().user.name).toEqual("李四-张三");
      done();
    }, 3000);

    type OptionalKnownKeys<T> = {
      [K in keyof T]: string extends K ? never : number extends K ? never : {} extends Pick<T, K> ? K : never
    } extends { [_ in keyof T]: infer U }
      ? ({} extends U ? never : U)
      : never;

    type Action = {
      payload?: {};
      meta?: {};
    };

    type Pack<T extends Action> = "payload" | "meta" extends keyof T
      ? "payload" extends OptionalKnownKeys<T>
        ? "meta" extends OptionalKnownKeys<T>
          ? [T["payload"], T["meta"]?] | [null, T["meta"]?]
          : [T["payload"], T["meta"]] | [null, T["meta"]?]
        : "meta" extends OptionalKnownKeys<T>
        ? [T["payload"], T["meta"]?]
        : [T["payload"], T["meta"]]
      : "payload" extends keyof T
      ? "payload" extends OptionalKnownKeys<T>
        ? [T["payload"]?]
        : [T["payload"]]
      : "meta" extends keyof T
      ? "meta" extends OptionalKnownKeys<T>
        ? [null, T["meta"]?]
        : [null, T["meta"]]
      : [];

    type PackFn<T extends Action> = "payload" | "meta" extends keyof T
      ? (payload: T["payload"], meta: T["meta"]) => void
      : "payload" extends keyof T
      ? (payload: T["payload"]) => void
      : "meta" extends keyof T
      ? (payload: null, meta: T["meta"]) => void
      : [];

    interface OnChangeNameRequest {
      payload?: {
        name?: string;
      };
    }

    const onChangeName = function(state: IState, action: OnChangeNameRequest) {
      return { ...state, ...action.payload };
    };

    type ParamOne = Parameters<typeof onChangeName>[1];

    type s = "payload" extends OptionalKnownKeys<OnChangeNameRequest> ? "1" : "0";

    type p = PackFn<OnChangeNameRequest>;

    let fns: p;

    // fns(null,{})

    fns({});

    fns({});
  });
});
