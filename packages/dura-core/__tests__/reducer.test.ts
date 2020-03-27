import { create } from "../src/index";

function getUserModel() {
  return {
    state: () => ({
      name: undefined
    }),
    reducers: () => ({
      onChangeName(state, payload: { newName: string }) {
        return { ...state, name: payload.newName };
      },
      emptyAction(state) {
        return state;
      },
      errorChange(state) {
        throw new Error("错误");
      }
    }),
    effects: () => ({})
  };
}

describe("测试reducers", function() {
  it("通过reducer修改state", function() {
    const UserModel = getUserModel();

    const rootModel = {
      user: UserModel
    };

    const store = create({
      initialModel: rootModel
    });

    const { dispatch, getState } = store;

    expect(getState().user.name).toBeUndefined();

    dispatch({
      type: "user/onChangeName",
      payload: {
        newName: "张三"
      }
    });

    expect(getState().user.name).toEqual("张三");
  });

  it("空的payload和meta", function() {
    const UserModel = getUserModel();

    const rootModel = {
      user: UserModel
    };

    const store = create({
      initialModel: rootModel
    });

    const { dispatch, getState } = store;

    expect(getState().user.name).toBeUndefined();

    dispatch({
      type: "user/emptyAction"
    });

    expect(getState().user.name).toBeUndefined();
  });

  it("测试reducer报错", function() {
    const UserModel = getUserModel();

    const rootModel = {
      user: UserModel
    };

    const store = create({
      initialModel: rootModel
    });

    const { dispatch, getState } = store;

    expect(getState().user.name).toBeUndefined();

    dispatch({
      type: "user/errorChange"
    });

    expect(getState().user.name).toBeUndefined();
  });
});
