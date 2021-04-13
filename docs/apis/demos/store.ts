import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createDura } from '../../../src';

type User = {
  name: string;
  age: number;
};
const store = createStore(
  (state = { name: '' }) => state,
  composeWithDevTools(createDura()),
);

export const user = store.defineLeaf({
  namespace: 'user',
  initialState: {
    users: {} as User,
    name: '张三',
    age: 0,
    address: {
      name: '南京市',
    },
    visable: false,
  },
  reducers: {
    onChangeAge(state, age: number) {
      state.age = age;
    },
    onShow() {},
  },
});

// store.defineLeaf(){}
