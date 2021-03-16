import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { create, FluxAction } from '../../../src/index';

const store = createStore((state = {}) => state, composeWithDevTools(create()));

export const user = store.createSlice({
  namespace: 'user',
  initialState: {
    name: '张三',
  },
  reducers: {
    onChangeName(state, action: FluxAction<{ newName }>) {
      state.name = action.payload.newName;
    },
  },
});
