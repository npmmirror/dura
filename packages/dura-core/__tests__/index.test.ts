import { create } from "../src/index";
import {
  ExtractRootState,
  RequestForEffect,
  Plugin,
  ExtractRootEffects,
  ExtractDispatch,
  Model,
  RootModel,
  DuraAction
} from "@dura/types";

describe("单元测试", function() {
  it("测试创建store", function() {
    const userInitState = {
      name: undefined,
      sex: undefined
    };

    const user = {
      state: userInitState
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
    });

    function getState(): RootState {
      return store.getState();
    }

    expect(getState()).toEqual({ user: userInitState });
  });

  it("测试reducers", function() {
    const userInitState = {
      name: undefined,
      sex: undefined
    };

    const user = {
      state: userInitState,
      reducers: {
        onChangeName(state: typeof userInitState, action: DuraAction<{ name?: string }, {}>) {
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

    const store = create({
      initialModel: initModel
    });

    type RootState = ExtractRootState<typeof initModel>;
    type Dispatch = ExtractDispatch<typeof initModel>;

    function getState(): RootState {
      return store.getState() as RootState;
    }

    function getDispatch(): Dispatch {
      return store.dispatch as Dispatch;
    }

    expect(getState()).toEqual({ user: userInitState });

    getDispatch().user.onChangeName({ name: "张三" });

    expect(getState()).toEqual({ user: { ...userInitState, name: "张三" } });
  });
});
