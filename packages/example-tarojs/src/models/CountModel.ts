import { EffectApi } from "@dura/plus";
import { actionCreator } from "../store/index";

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
      effectApi: EffectApi,
      action: { payload: { count: number }; meta?: { loading: boolean } }
    ) {
      await effectApi.delay(2000);
      effectApi.dispatch(actionCreator.count.onChangeCount(action.payload));
    }
  }
};
