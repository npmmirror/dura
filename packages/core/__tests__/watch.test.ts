import { defineStoreSlice, configura } from '../src';
import { Action } from '@dura/types';

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
    onChangeAge(state, action: Action<{ newAge: number }>) {
      state.age = action.payload.newAge;
    },
  },
  effects: {
    async asyncChangeName(action: Action<{ name: string }>) {
      store.actions.user.onChangeName(action.payload);
    },
  },
  watchs: {
    a: {
      dep: (state) => [state.name],
      handler: async (state) => {
        store.actions.user.onChangeAge({ newAge: 12 });
      },
      immediate: true,
    },
    b: {
      dep: (state) => [state.age],
      handler: async (state) => {
        console.log(state.age);
      },
    },
  },
});
const createStore = configura();
const store = createStore(user);

describe('test watch', function () {
  it('test plain watch', function () {
    // store.actions.user.asyncChangeName({ name: 'xx1' });
    // store.actions.user.asyncChangeName({ name: 'xx2' });
    // store.actions.user.onChangeName({ name: 'xx2' });
    // expect(store.getState().user.name).toEqual('xx2');
    // expect(store.getState().user.age).toEqual(12);
  });
});
