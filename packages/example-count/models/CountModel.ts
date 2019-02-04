const initialState = {
  count: 0 as number
};

type State = typeof initialState;

export default {
  state: initialState,
  reducers: {
    onPlusCount() {
      return function(state: State) {
        return { ...state, count: state.count + 1 };
      };
    }
  }
};
