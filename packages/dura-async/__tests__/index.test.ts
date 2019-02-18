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

    const user = {
      state: initialState,
      reducers: {
        /**
         * 修改用户姓名
         * @param payload
         */
        onChangeName(payload: { name: string }) {
          return function(state: IState) {
            return { ...state, ...payload };
          };
        }
      },
      effects: {
        /**
         * 异步的修改用户姓名
         * @param payload
         */
        onAsyncChangeName(payload: { name: string }) {
          return async function(request: EffectAPI<RootState>) {
            await request.delay(1500);
            reducerRunner.user.onChangeName({ name: `${payload.name}-${request.getState().user.name}` });
          };
        }
      }
    };

    const initModel = {
      user,
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
      payload:{
        [name:string]:any
      },
      meta:{
        [name:string]:any
      }
    };

   
    type M = {

    }


    type P = OptionalKnownKeys<{
      payload:{

      },
      meta:{
        
      }
    }>

    type Pack<T extends Action> = 
      "paylaod" | "meta" extends keyof T ? 
          "payload" extends OptionalKnownKeys<T> ? 
                "meta" extends OptionalKnownKeys<T> ? [T["payload"]?, T["meta"]?] : [T["payload"] | null, T["meta"]]
        : [T["payload"], T["meta"]]
                  : "payload" extends keyof T
                  ? "payload" extends OptionalKnownKeys<T>
                    ? [T["payload"]?]
                    : [T["payload"]]
                  : "meta" extends keyof T
                  ? "meta" extends OptionalKnownKeys<T>
                    ? [T["meta"]?]
                    : [T["meta"]]
      : [];

      

    const onChangeName = function(state: IState, action: { payload: { name: string }; meta: { loading: true } }) {
      return { ...state, ...action.payload };
    };

    type ParamType = Pack<Parameters<typeof onChangeName>[1]>;

    type Fn = (...args: ParamType) => void;

    let fns: Fn;

    fns({ name: "张三" });


    

  });
});
