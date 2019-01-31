import { create, createActionCreator } from "../src/index";
import { ExtractRootState, ERequest, Plugin, Model, DuraAction, ExtractRootAction, DuraStore } from "@dura/types";

describe("单元测试", function() {
  it("测试创建store", function() {
    const initialState = {
      name: undefined,
      sex: undefined
    };

    const user = {
      state: initialState
    };

    const initialModel = {
      /**
       * 用户模块
       */
      user
    };

    type RootState = ExtractRootState<typeof initialModel>;

    const store = create({
      initialModel: initialModel
    }) as DuraStore<RootState>;

    expect(store.getState()).toEqual({ user: initialState });
  });

  it("测试初始化全局的state", function() {
    const initialState = {
      name: undefined,
      sex: undefined
    };

    const user = {
      state: initialState
    };

    const initialModel = {
      /**
       * 用户模块
       */
      user
    };

    type RootState = ExtractRootState<typeof initialModel>;

    const store = create({
      initialModel: initialModel,
      initialState: {
        user: {
          name: "张三",
          sex: "女"
        }
      }
    }) as DuraStore<RootState>;

    expect(store.getState()).toEqual({
      user: {
        name: "张三",
        sex: "女"
      }
    });
  });

  it("测试reducers", function() {
    const initialState = {
      name: undefined,
      sex: undefined
    };

    type IState = typeof initialState;

    const user = {
      state: initialState,
      reducers: {
        onChangeName(state: IState, action: DuraAction<{ name: string }>) {
          return {
            ...state,
            name: action.payload.name
          };
        }
      }
    };

    const initModel = {
      user
    };

    type RootState = ExtractRootState<typeof initModel>;
    type RootAction = ExtractRootAction<typeof initModel>;

    const store = create({
      initialModel: initModel
    }) as DuraStore<RootState, RootAction>;

    const actionCreator = store.actionCreator;

    expect(store.getState().user).toEqual(initialState);

    store.dispatch(actionCreator.user.onChangeName({ name: "张三" }));

    expect(store.getState().user).toEqual({ ...initialState, name: "张三" });
  });

  it("测试普通的effects", function(done) {
    const initialState = {
      /**
       * 用户姓名
       */
      name: "默认",
      /**
       * 用户性别
       */
      sex: undefined
    };

    type IState = typeof initialState;

    const user = {
      state: initialState,
      reducers: {
        onChangeName(state: IState, action: DuraAction<{ name?: string }>) {
          return {
            ...state,
            name: action.payload.name
          };
        }
      },
      effects: {
        async onAsyncChangeName(request) {
          type Payload = { name: string };
          const { dispatch, action, select, delay } = request as Request<Payload>;
          const { name } = action.payload;
          const oldName = select(state => state.user.name);
          await delay(1000);
          const newName = `${oldName}${name}`;
          dispatch(
            actionCreator.user.onChangeName({
              name: newName
            })
          );
        }
      }
    };

    const initModel = {
      /**
       * 用户基础模块
       */
      user
    };

    type RootState = ExtractRootState<typeof initModel>;
    type RootAction = ExtractRootAction<typeof initModel>;

    type Request<P> = ERequest<P, RootState, RootAction>;

    const store = create({
      initialModel: initModel
    }) as DuraStore<RootState, RootAction>;

    const actionCreator = store.actionCreator;

    expect(store.getState().user).toEqual(initialState);

    store.dispatch(actionCreator.user.onAsyncChangeName({ name: "张三" }));

    setTimeout(() => {
      expect(store.getState().user.name).toEqual("默认张三");
      done();
    }, 3000);
  });

  it("测试插件", function() {
    const plugin: Plugin = {
      name: "test",
      model: {
        state: {}
      },
      wrapModel(model: Model) {
        return model;
      },
      intercept: {
        pre: action => true,
        before: (action, dispatch) => {},
        after: (action, dispatch) => {}
      }
    };

    create({
      initialModel: {
        user: {
          state: {}
        }
      },
      plugins: [plugin]
    });
  });
});
