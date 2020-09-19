import { configura, defineStoreSlice } from '../src';
import { renderHook, act } from '@testing-library/react-hooks';
import { DURA_PATCHES_SYMBOL, DURA_SYMBOL } from '@dura/utils';

let name = 'default';
const user = defineStoreSlice({
  namespace: 'user',
  state: {
    /** 姓名 */
    name: '张三',
  },
  reducers: {
    onChangeName(state, action) {
      console.log('reducer-->onChangeName', action);

      state.name = action.payload.name;
    },
  },
  effects: {
    async onAsyncQuery(action) {
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
    onChangeId(state, action) {
      state.id = action.payload.id;
    },
    onChangeSku(state, action) {
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
    const next = createStore(user);
    const store1 = next();

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
      hooks1.result.current.actions.user.onChangeName({ name: '李四' });
    });
    // Object.keys(hooks1.result.current.store.user).forEach((n: any) => {
    //   console.log(n, n === DURA_PATCHES_SYMBOL);
    // });
    console.log(DURA_PATCHES_SYMBOL);
    console.log(hooks1.result.current.store.user);
    console.log(hooks1.result.current.store.user[DURA_PATCHES_SYMBOL]);
    console.log(hooks1.result.current.store.user[DURA_SYMBOL]);

    expect(hooks1.result.current.store.user.name).toEqual('李四');
    expect(hooks1.result.current.store.user[DURA_PATCHES_SYMBOL]).toEqual([
      'user.name',
    ]);
    act(() => {
      hooks1.result.current.actions.user.onChangeName({ name: '王五' });
    });
    expect(hooks1.result.current.store.user.name).toEqual('王五');
    expect(hooks1.result.current.store.user[DURA_PATCHES_SYMBOL]).toEqual([
      'user.name',
    ]);
  });

  it('test next store', function () {
    const createStore = configura();
    const next = createStore(user);

    const store2 = next(order);

    const hooks2 = renderHook(() => {
      const mount = store2.useMount();
      const store = store2.useStore();
      const actions = store2.useActions();
      store.order.id;
      store.order.skuSource.forEach((n) => {
        n.name;
        n.id;
        n.price;
      });
      return { mount, store, actions };
    });
    expect(hooks2.result.current.store.order.id).toEqual(12);
    act(() => {
      hooks2.result.current.actions.order.onChangeId({ id: 99 });
    });
    expect(hooks2.result.current.store.order.id).toEqual(99);
    expect(hooks2.result.current.store.order[DURA_PATCHES_SYMBOL]).toEqual([
      'order.id',
    ]);
    act(() => {
      hooks2.result.current.actions.order.onChangeSku({
        id: 2,
        newName: '新的手机',
      });
    });
    expect(hooks2.result.current.store.order.skuSource[1].name).toEqual(
      '新的手机',
    );
    hooks2.rerender();
    expect(hooks2.result.current.store.order.skuSource[1].name).toEqual(
      '新的手机',
    );
    hooks2.unmount();

    expect(store2.getState().order).toBeUndefined();
    expect(store2.actions.order).toBeUndefined();
  });
});
