import { createStore, combineReducers, compose } from 'redux';
import { createDuraEnhancer, Action } from '@dura/react';
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
  console.log(state, action);

  return state;
}, $compose(dura));

export const a = createSlice({
  namespace: 'user',
  initialState: {
    name: '',
  },
  reducers: {
    changeName(state, action: FluxAction<{ name: string }, {}>) {
      console.log('changeName');
      state.name = action?.payload?.name;
    },
    changeAge(state, action) {},
  },
});
