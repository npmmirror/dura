import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createDura } from '../../../src';

const store = createStore(
  (state = {}) => state,
  composeWithDevTools(createDura()),
);

export const user = store.defineLeaf({
  namespace: 'user',
  initialState: {
    name: '张三',
    age: 0,
    address: {
      name: '南京市',
    },
  },
  reducers: {
    onChangeName(state, newName: string, age: number) {
      state.name = newName;
      state.age = age;
    },
    onShow() {},
  },
});
// store.defineLeaf(){}
