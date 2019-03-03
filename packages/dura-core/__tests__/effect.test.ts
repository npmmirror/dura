import { create } from "../src/index";
import {EffectApi, ExtractState} from '@dura/types'

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
          const name = effectApi.select((state: ExtractState<typeof rootModels>) => state.user.name);

          if (!name) {
            dispatch(actionCreator.user.onChangeName({ newName: action.payload.nextName }));
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

    const { dispatch, getState, actionCreator } = store;

    expect(getState().user.name).toBeUndefined();

    dispatch(actionCreator.user.onAsyncChangeName({ nextName: "张三" }));

    setTimeout(() => {
      expect(getState().user.name).toEqual("张三");
      done();
    }, 2000);
  });
});
