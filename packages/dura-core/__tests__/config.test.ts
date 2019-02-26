import { create, createActionCreator } from "../src/index";

function getUserModel() {
  return {
    state: {
      name: undefined
    },
    reducers: {
      onChangeName(state, action: { payload: { newName: string } }) {
        return { ...state, name: action.payload.newName };
      }
    },
    effects: {}
  };
}

describe("测试配置信息", function() {
  it("测试initialModel", function() {
    const store = create({
      initialModel: {
        user: getUserModel()
      }
    });

    expect(store.getState().user.name).toBeUndefined();
  });

  it("测试initialState", function() {
    const store = create({
      initialModel: {
        user: getUserModel()
      },
      initialState: {
        user: {
          name: "张三"
        }
      }
    });

    expect(store.getState().user.name).toEqual("张三");
  });

  it("测试传入中间件", function() {
    const rootModel = {
      user: getUserModel()
    };

    const store = create({
      initialModel: rootModel,
      middlewares: [store => next => action => next({ ...action, type: "h" })]
    });

    const actions = createActionCreator(rootModel);

    const { dispatch, getState } = store;

    expect(getState().user.name).toBeUndefined();

    dispatch(actions.user.onChangeName({ newName: "张三" }));

    expect(getState().user.name).toBeUndefined();
  });

  it("测试传入compose", function() {
    const storeCreator = () =>
      create({
        initialModel: {
          user: getUserModel()
        },
        middlewares: [store => next => action => next({ ...action, type: "h" })],
        compose: function(...funcs) {
          if (1 == 1) {
            throw "异常";
          }

          if (funcs.length === 0) {
            return arg => arg;
          }

          if (funcs.length === 1) {
            return funcs[0];
          }

          return funcs.reduce((a, b) => (...args) => a(b(...args)));
        }
      });

    expect(() => storeCreator()).toThrow("异常");
  });

  it("测试传入createStore", function() {
    const store = create({
      initialModel: {
        user: getUserModel()
      },
      createStore: () => false
    });

    expect(store.getState).toBeUndefined();
  });
});
