import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createDura, FluxAction } from '../../../src/run';

const store = createStore(
  (state = {}) => state,
  composeWithDevTools(createDura()),
);

export const user = store.createSlice({
  namespace: 'user',
  initialState: {
    name: '张三',
    age: 0,
  },
  reducers: {
    onChangeName(state, newName: string, age: number) {
      state.name = newName;
      state.age = age;
    },
  },
});
