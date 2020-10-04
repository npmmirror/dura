import { defineStoreSlice, configura } from '../src';
import { Action } from '@dura/types';

describe('test debounce', function () {
  it('test plain debunce', function (done) {
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
      }, 16);
    }, 40);
  });

  it('test iife debounce', function (done) {
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
    const meta = {
      debounce: {
        wait: 500,
        leading: true,
        trailing: true,
      },
    };
    store.actions.user.asyncChangeName({ name: 'xx1' }, meta);
    store.actions.user.asyncChangeName({ name: 'xx2' }, meta);
    store.actions.user.asyncChangeName({ name: 'xx3' }, meta);
    expect(store.getState().user.name).toEqual('xx1');
    setTimeout(() => {
      expect(store.getState().user.name).toEqual('xx3');
      done();
    }, 500);
  });
});
