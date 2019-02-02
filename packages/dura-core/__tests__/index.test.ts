import { create, DuraStore, RootModel, Model } from "../src/index";

describe("单元测试", function() {
  it("测试reducers", function() {
    const initialState = {
      name: undefined,
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
      }
    };

    const initModel = {
      user
    };

    const store = create({
      initialModel: initModel
    }) as DuraStore<typeof initModel>;

    const reducerRunner = store.reducerRunner;

    expect(store.getState().user.name).toBeUndefined();

    reducerRunner.user.onChangeName({ name: "李四" });

    expect(store.getState().user.name).toEqual("李四");

    reducerRunner.user.onChangeName({ name: "张三" });

    expect(store.getState().user.name).toEqual("张三");
  });

  it("测试initialState", function() {
    const initialState = {
      name: undefined,
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
      }
    };
    const initModel = {
      user
    };
    const store = create({
      initialModel: initModel,
      initialState: { user: { name: "张三", sex: undefined } }
    }) as DuraStore<typeof initModel>;

    expect(store.getState().user.name).toEqual("张三");
  });

  it("测试plugin", function() {
    const initialState = {
      name: undefined,
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
      }
    };

    const initModel = {
      user
    };

    const store = create({
      initialModel: initModel,
      plugins: [
        {
          name: "test",
          model: {
            state: {}
          },
          onWrapModel: (name: string, model: Model<any>) => model,
          onCreateMiddleware: (rootModel: RootModel) => store => next => action => next(action),
          onStoreCreated: (store: DuraStore, rootModel: RootModel) => false
        }
      ]
    }) as DuraStore<typeof initModel>;
  });
});
