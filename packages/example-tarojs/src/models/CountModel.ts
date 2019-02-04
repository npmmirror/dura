import { EffectAPI } from "@dura/async";
import { RootModel, reducerRunner } from "../store/index";

const initialState = {
  count: 0 as number
};

type State = typeof initialState;

export default {
  state: initialState,
  reducers: {
    onChangeCount(payload: { count: number }) {
      return function(state: State) {
        return { ...state, count: state.count + payload.count };
      };
    }
  },
  effects: {
    onAsyncChangeCount(payload: { count: number }, meta?: { loading: boolean }) {
      return async function(effectApi: EffectAPI<RootModel>) {
        await effectApi.delay(2000);
        reducerRunner.count.onChangeCount(payload);
      };
    }
  }
};
