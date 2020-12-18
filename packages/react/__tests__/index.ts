import { configura } from '../src';
import { AnyAction } from 'redux';
import { Action } from '../src/type';

const createStore = configura();

const store = createStore();

const slice = store.createSlice('xx', { user: { name: 'xx' } });

const changeName = slice.defineReducers(function changeName(
  state,
  action: Action<{ name: string }>,
) {
  state.user.name = 'x';
});
