import {
  configura,
  defineStoreSlice,
  DURA_PATCHES_SYMBOL,
  Action,
} from '../src';
import { renderHook, act } from '@testing-library/react-hooks';

let name = 'default';
const user = defineStoreSlice({
  namespace: 'user',
  state: {
    /** 姓名 */
    name: '张三',
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
    async onAsyncQuery(action: Action<{ name: string }>) {
      name = action.payload.name;
    },
  },
});

const order = defineStoreSlice({
  namespace: 'order',
  state: {
    id: 12,
    skuSource: [
      {
        id: 1,
        name: '方便面',
        price: 5,
      },
      {
        id: 2,
        name: '手机',
        price: 2000,
      },
      {
        id: 3,
        name: '纸巾',
        price: 5,
      },
    ],
  },
  reducers: {
    onChangeId(state, action: Action<{ id: number }>) {
      state.id = action.payload.id;
    },
    onChangeSku(state, action: Action<{ id: number; newName: string }>) {
      state.skuSource.forEach((n) => {
        if (n.id === action.payload.id) {
          n.name = action.payload.newName;
        }
      });
    },
  },
  effects: {},
});

describe('test @dura/react', function () {
  it('test basic store', function () {
    const createStore = configura();
    const store1 = createStore(user);
    const hooks1 = renderHook(() => {
      const store = store1.useStore();
      const actions = store1.useActions();
      store.user.name;
      return {
        store,
        actions,
      };
    });
    expect(hooks1.result.current.store.user.name).toEqual('张三');
    act(() => {
      hooks1.result.current.actions.user.onChangeName({
        name: '李四',
      });
    });
    expect(hooks1.result.current.store.user.name).toEqual('李四');
    expect(hooks1.result.current.store.user[DURA_PATCHES_SYMBOL]).toEqual([
      'user.name',
    ]);
    act(() => {
      hooks1.result.current.actions.user.onChangeName({
        name: '王五',
      });
    });
    expect(hooks1.result.current.store.user.name).toEqual('王五');
    expect(hooks1.result.current.store.user[DURA_PATCHES_SYMBOL]).toEqual([
      'user.name',
    ]);

    act(() => hooks1.result.current.actions.user.onChangeAge({ newAge: 12 }));
  });
});
