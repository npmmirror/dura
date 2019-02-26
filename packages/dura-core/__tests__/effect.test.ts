import { create, EffectApi, createActionCreator, ExtractRootState } from "../src/index";

describe("测试effect", function() {
  it("测试effect", function(done) {
    type OnChangeNameAction = {
      payload: { newName: string };
    };

    type OnAsyncChangeNameAction = {
      payload: {
        /**
         * 新的姓名
         */
        nextName: string;
      };
    };

    const UserModel = {
      state: {
        name: undefined
      },
      reducers: {
        onChangeName(state, action: OnChangeNameAction) {
          return { ...state, name: action.payload.newName };
        }
      },
      effects: {
        /**
         * 异步修改用户姓名
         * @param effectApi
         * @param action
         */
        async onAsyncChangeName(effectApi: EffectApi, action: OnAsyncChangeNameAction) {
          await effectApi.delay(500);
          const name = effectApi.select((state: ExtractRootState<typeof rootModels>) => state.user.name);
          if (!name) {
            effectApi.dispatch(actions.user.onChangeName({ newName: action.payload.nextName }));
          }
        }
      }
    };

    const rootModels = {
      user: UserModel
    };

    const store = create({
      initialModel: rootModels
    });

    const actions = createActionCreator(rootModels);

    const { dispatch, getState } = store;

    expect(getState().user.name).toBeUndefined();

    dispatch(actions.user.onAsyncChangeName({ nextName: "张三" }));

    setTimeout(() => {
      expect(getState().user.name).toEqual("张三");
      done();
    }, 2000);
  });
});
