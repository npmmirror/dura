import { defineStoreSlice, configura } from '../src';
import { Action } from '@dura/types';

const deloy = (ms: number) =>
  new Promise((resolve, reject) => setTimeout(resolve, ms));
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
describe('test throttle', function () {
  it('test plain throttle', function (done) {
    store.actions.user.asyncChangeName({ name: 'xx1' }, { throttle: 50 });
    store.actions.user.asyncChangeName({ name: 'xx2' }, { throttle: 50 });
    store.actions.user.asyncChangeName({ name: 'xx3' }, { throttle: 50 });
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

  it('test iife throttle', function (done) {
    const meta = {
      throttle: {
        wait: 50,
        leading: true,
      },
    };
    store.actions.user.asyncChangeName({ name: 'xx11' }, meta);
    store.actions.user.asyncChangeName({ name: 'xx2' }, meta);
    store.actions.user.asyncChangeName({ name: 'xx3' }, meta);
    expect(store.getState().user.name).toEqual('xx11');
    setTimeout(() => {
      expect(store.getState().user.name).not.toEqual('xx3');
      expect(store.getState().user.name).toEqual('xx11');
      setTimeout(() => {
        expect(store.getState().user.name).toEqual('xx3');
        done();
      }, 10);
    }, 40);
  });
});
