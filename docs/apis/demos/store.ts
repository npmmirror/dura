import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createDura } from '../../../src';

type User = {
  name: string;
  age: number;
};
const store = createStore(
  (state = { name: '' }) => state,
  composeWithDevTools(createDura()),
);

export const hello = store.defineLeaf({
  namespace: 'hello',
  initialState: {
    user: {
      name: '张三',
    },
  },
  reducers: {
    onChangeName(state, name: string) {
      state.user.name = name;
    },
  },
});

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

user.useOnChangeAge({ transform: '' });

// store.defineLeaf(){}
