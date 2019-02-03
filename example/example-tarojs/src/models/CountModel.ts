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
  }
};
