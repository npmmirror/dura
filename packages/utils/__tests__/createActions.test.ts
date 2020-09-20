import { createActionsFactory } from '../src';
import type { Store as ReduxStore } from 'redux';
import {
  StoreSlice,
  JsonObject,
  ReducersMapOfStoreSlice,
  EffectsMapOfStoreSlice,
} from '@dura/types';

describe('test createActions', function () {
  it('test createActions', function () {
    function defineStore<
      N extends string,
      S,
      R extends ReducersMapOfStoreSlice<S>,
      E extends EffectsMapOfStoreSlice,
      STORE extends StoreSlice<N, S, R, E> = StoreSlice<N, S, R, E>
    >(store: STORE): STORE {
      return store;
    }

    const user = defineStore({
      namespace: 'user',
      state: {
        age: 12,
      },
      reducers: {
        onChangeUser(state, action) {},
      },
      effects: {
        async onAsyncQuery(action: number) {},
      },
    });

    const order = defineStore({
      namespace: 'order',
      state: {},
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
