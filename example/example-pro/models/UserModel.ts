import { EffectAPI } from "@dura/async";
import { LoadingMeta } from "@dura/async-loading";
import { RootModel, reducerRunner } from "../src/store";

const initialState = {
  /**
   * 姓名
   */
  name: "默认姓名" as string,
  /**
   * 性别
   */
  sex: undefined as "男" | "女",
  /**
   * 年龄
   */
  age: undefined as number
};

type State = typeof initialState;

export default {
  state: initialState,
  reducers: {
    /**
     *
     * @param payload 同步修改姓名
     */
    onChangeName(payload: { newName: string }) {
      return function(state: State): State {
        state.name = payload.newName;
        return state;
      };
    }
  },
  effects: {
    /**
     * 异步修改姓名
     * @param payload
     */
    onAsyncChangeName(payload: { newName: string }, meta: LoadingMeta) {
      return async function(effectApi: EffectAPI<RootModel>) {
        await effectApi.delay(5500);
        reducerRunner.user.onChangeName(payload);
      };
    }
  }
};
