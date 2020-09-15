import { configura, defineStore } from "..";

const userModel = defineStore({
  namespace: "user",
  state: {
    /** 姓名 */
    name: "张三",
  },
  reducers: {
    onChangeName(state, action) {
      return { ...state, name: action.payload.name };
    },
  },
});

const orderModel = defineStore({
  namespace: "order",
  state: {
    id: 12,
  },
  reducers: {
    onChangeId(state, action: { payload: { name: string } }) {
      return { ...state, name: action?.payload?.name };
    },
  },
});

describe("test", function () {
  it("create dura stat", function () {
    const cfg = configura();

    cfg([userModel]);
  });
});
