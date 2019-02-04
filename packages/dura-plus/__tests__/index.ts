import { create, PlusDuraStore, EffectAPI, PlusRootState } from "../src/index";

describe("测试plus", function() {
  it("简单的测试", function() {
    const initialModel = {
      user: {
        state: {},
        reducers: {},
        effects: {
          onAsyncChangeName() {
            return function() {};
          }
        }
      }
    };

    const store = create(initialModel, {}) as PlusDuraStore<typeof initialModel>;
  });
});
