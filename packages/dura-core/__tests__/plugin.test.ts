import { create, Plugin } from "../src";

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

function getLoadingPlugin() {
  type LoadingChangeRequest = {
    payload: {
      nextLoadingStatus: boolean;
    };
  };
  return {
    extraModels: {
      /**
       * 加载模块
       */
      loading: {
        state: {
          loadingStatus: false
        },
        reducers: {
          /**
           * doc
           * @param state
           * @param action
           */
          loadingChange(state, action: LoadingChangeRequest) {
            return { ...state, loadingStatus: action.payload.nextLoadingStatus };
          }
        },
        effects: {}
      }
    }
  };
}

describe("测试插件模块", function() {
  it("测试插件的model", function() {
    const config = {
      initialModel: {
        user: getUserModel()
      },
      plugins: {
        loadingPlugin: getLoadingPlugin()
      }
    };

    const store = create(config);

    const { actionCreator, getState, dispatch } = store;

    expect(getState().loading.loadingStatus).toEqual(false);

    dispatch(actionCreator.loading.loadingChange({ nextLoadingStatus: true }));

    expect(getState().loading.loadingStatus).toEqual(true);
  });

  it("测试插件的middleware", function() {
    const mPlugin: Plugin = {
      middlewares: [store => next => action => next({ ...action, type: "h" })]
    };
    const config = {
      initialModel: {
        user: getUserModel()
      },
      plugins: {
        m: mPlugin
      }
    };

    const store = create(config);

    const { getState, dispatch, actionCreator } = store;

    expect(getState().user.name).toBeUndefined();

    dispatch(actionCreator.user.onChangeName({ newName: "张三" }));

    expect(getState().user.name).toBeUndefined();
  });

  it("测试插件的onModel", function() {
    const oPlugin: Plugin = {
      onModel: model => {
        return { ...model, state: { ...model.state, name: "张三" } };
      }
    };

    const qPlugin: Plugin = {
      onModel: model => {
        return { ...model, state: { ...model.state, sex: "男" } };
      }
    };

    const config = {
      initialModel: {
        user: getUserModel()
      },
      plugins: {
        m: oPlugin,
        q: qPlugin
      }
    };

    const store = create(config);

    expect(store.getState().user.name).toEqual("张三");

    expect(store.getState().user).toEqual({ name: "张三", sex: "男" });
  });
});
