import { defineStoreSlice, configura } from '../src';
import { Action } from '@dura/types';

describe('test computed', function () {
  it('test plain computed', function () {
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
      computed: {
        change(state) {},
      },
    });
    const createStore = configura();
    const store = createStore(user);
  });
});
