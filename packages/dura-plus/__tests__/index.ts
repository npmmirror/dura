import { store } from "./store/store";

describe("测试plus", function() {
  it("简单的测试", function() {
    store.effectRunner.user.onAsyncChangeName({ name: "张三" });

    console.log(store.getState());
  });
});
