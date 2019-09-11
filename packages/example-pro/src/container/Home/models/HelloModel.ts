const initialState = () => {
  return {
    name: '张三'
  };
};

type State = ReturnType<typeof initialState>;

const reducers = () => {
  return {
    onChangeName(state: State, payload: { nextName: string }) {
      state.name = payload.nextName;
    }
  };
};

const effects = () => {
  return {};
};

export default {
  state: initialState,
  reducers: reducers,
  effects: effects
};
