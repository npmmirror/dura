import { LoadingMeta, EffectAPI } from "../../src/index";
import { RootState, reducerRunner, effectRunner } from "../store/store";

const initialState = {
  name: undefined as string,
  sex: undefined as "男" | "女",
  age: undefined as number
};

type State = typeof initialState;

export default {
  state: initialState,
  reducers: {
    onChangeName(payload: { name: string }) {
      return function(state: State) {
        state.name = payload.name;
        return state;
      };
    }
  },
  effects: {
    onAsyncChangeName(payload: { name: string }, meta?: LoadingMeta) {
      return async function(effectApi: EffectAPI<RootState>) {
        await effectApi.delay(1000);
        reducerRunner.user.onChangeName(payload);
      };
    }
  }
};
