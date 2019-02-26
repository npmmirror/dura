import { create } from "../src/index";

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
});
