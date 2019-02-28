import { EffectAPI } from "@dura/async";
import { actionCreator } from "../src/store";
import { OnChangeNameAction, OnAsyncChangeName } from "./UserMode";

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
    onChangeName(state: State, action: OnChangeNameAction): State {
      state.name = action.payload.newName + "9";
      return state;
    }
  },
  effects: {
    /**
     * 异步修改姓名
     * @param payload
     */
    async onAsyncChangeName(effectApi: EffectAPI, action: OnAsyncChangeName) {
      await effectApi.delay(5500);
      effectApi.dispatch(
        actionCreator.user.onChangeName({
          newName: action.payload.newName
        })
      );
    }
  }
};
