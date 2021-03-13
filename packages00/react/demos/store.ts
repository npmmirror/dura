import { createStore, compose } from 'redux';

import { create } from './lib';
import { FluxAction } from './lib/types';

const $compose: typeof compose =
  typeof window === 'object' && window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']
    ? window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']({
        name: 'dura',
        trace: true,
      })
    : compose;

const dura = create('');

const { createSlice } = createStore((state = {}, action) => {
  return state;
}, $compose(dura));

export const a = createSlice({
  namespace: 'user',
  initialState: {
    name: '',
    age: 12,
    lists: [
      {
        id: 1,
        name: 'zhangsan',
      },
    ],
  },
  reducers: {
    changeName(state, action: FluxAction<{ name: string }, {}>) {
      state.name = action?.payload?.name;
    },
    changeAge(state, action) {
      state.age = 33;
    },
    changeUserName(state) {
      state.lists[0].name = 'xx' + Math.random();
    },
  },
});
