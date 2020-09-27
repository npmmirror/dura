import { defineStoreSlice, configura } from '../src';
import { Action } from '@dura/types';

const deloy = (ms: number) =>
  new Promise((resolve, reject) => setTimeout(resolve, ms));
const user = defineStoreSlice({
  namespace: 'user',
  state: {
    name: 'default',
    age: 12,
  },
  reducers: {
    onChangeName(state, action: Action<{ name: string }>) {
      state.name = action.payload.name;
    },
    onChangeAge(state) {
      state.age = 99;
    },
  },
  effects: {
    async asyncChangeName(action: Action<{ name: string }>) {
      store.actions.user.onChangeName(action.payload);
    },
  },
  watchs: {
    testW(state) {
      console.log('watch-->', state.name);
    },
  },
});
const createStore = configura();
const store = createStore(user);

describe('test watch', function () {
  it('test plain watch', function () {
    store.actions.user.asyncChangeName({ name: 'xx1' });
    store.actions.user.asyncChangeName({ name: 'xx2' });
    store.actions.user.onChangeAge();
    expect(store.getState().user.name).toEqual('xx2');
  });
});
