import { EffectAPI } from "@dura/async";
import { reducerRunner } from "../store/index";

const initialState = {
  count: 0 as number
};

type State = typeof initialState;

export default {
  state: initialState,
  reducers: {
    onChangeCount(state: State, action: { payload: { count: number } }): State {
      return { ...state, count: state.count + action.payload.count };
    }
  },
  effects: {
    async onAsyncChangeCount(
      action: { payload: { count: number }; meta?: { loading: boolean } },
      effectApi: EffectAPI
    ) {
      await effectApi.delay(2000);
      reducerRunner.count.onChangeCount(action.payload);
    }
  }
};
