import { createActionsFactory } from '../src';
import type { Store as ReduxStore } from 'redux';
import {
  StoreSlice,
  JsonObject,
  ReducersMapOfStoreSlice,
  EffectsMapOfStoreSlice,
  Action,
} from '@dura/types';

function defineStore<
  N extends string,
  S,
  R extends ReducersMapOfStoreSlice<S>,
  E extends EffectsMapOfStoreSlice,
  STORE extends StoreSlice<N, S, R, E> = StoreSlice<N, S, R, E>
>(store: STORE): STORE {
  return store;
}

describe('test createActions', function () {
  it('test debounce', function (done) {
    let name = 'default';

    const user = defineStore({
      namespace: 'user',
      state: {
        age: 12,
      },
      reducers: {
        onChangeUser(state, action: Action) {},
      },
      effects: {
        async onAsyncQuery(action: Action<{ name: string }>) {},
      },
    });
    const dispatch = (action) => {
      name = action.payload.name;
    };

    expect(name).toEqual('default');

    const createActions = createActionsFactory({ dispatch } as ReduxStore);

    const actions = createActions(user);

    actions.user.onAsyncQuery({ name: '1' }, { debounce: 500 });
    actions.user.onAsyncQuery({ name: '2' }, { debounce: 500 });
    actions.user.onAsyncQuery({ name: '3' }, { debounce: 500 });
    expect(name).toEqual('default');
    setTimeout(() => {
      expect(name).toEqual('1');
      done();
    }, 1000);
  }),
    it('test createActions', function () {
      const order = defineStore({
        namespace: 'order',
        state: {},
      });

      const user = defineStore({
        namespace: 'user',
        state: {
          age: 12,
        },
        reducers: {
          onChangeUser(state, action: Action) {},
        },
        effects: {
          async onAsyncQuery(action: Action) {},
        },
      });
      let name = 'default';

      const dispatch = (action) => {
        name = action.payload;
      };

      expect(name).toEqual('default');

      const createActions = createActionsFactory({ dispatch } as ReduxStore);

      const actions = createActions(user, order);

      actions.user.onChangeUser('zhangsan');

      expect(name).toEqual('zhangsan');
    });
});
