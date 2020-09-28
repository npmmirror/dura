import { defineStoreSlice, configura } from '../src';
import { Action } from '@dura/types';

const user = defineStoreSlice({
  namespace: 'user',
  state: {
    name: 'default',
  },
  reducers: {
    onChangeName(state, action: Action<{ name: string }>) {
      state.name = action.payload.name;
    },
  },
  effects: {
    async asyncChangeName(action: Action<{ name: string }>) {
      store.actions.user.onChangeName(action.payload);
    },
  },
});
const createStore = configura();
const store = createStore(user);
describe('test debounce', function () {
  it('test plain debunce', function (done) {
    store.actions.user.asyncChangeName({ name: 'xx1' }, { debounce: 50 });
    store.actions.user.asyncChangeName({ name: 'xx2' }, { debounce: 50 });
    store.actions.user.asyncChangeName({ name: 'xx3' }, { debounce: 50 });
    expect(store.getState().user.name).toEqual('default');
    setTimeout(() => {
      expect(store.getState().user.name).not.toEqual('xx3');
      expect(store.getState().user.name).toEqual('default');
      setTimeout(() => {
        expect(store.getState().user.name).toEqual('xx3');
        done();
      }, 10);
    }, 40);
  });

  it('test iife debounce', function (done) {
    const meta = {
      debounce: {
        wait: 50,
        iife: true,
      },
    };
    store.actions.user.asyncChangeName({ name: 'xx1' }, meta);
    store.actions.user.asyncChangeName({ name: 'xx2' }, meta);
    store.actions.user.asyncChangeName({ name: 'xx3' }, meta);
    expect(store.getState().user.name).toEqual('xx1');
    setTimeout(() => {
      expect(store.getState().user.name).not.toEqual('xx3');
      expect(store.getState().user.name).toEqual('xx1');
      setTimeout(() => {
        expect(store.getState().user.name).toEqual('xx3');
        done();
      }, 10);
    }, 40);
  });
});
