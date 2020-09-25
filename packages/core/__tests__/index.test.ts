import { defineStoreSlice, configura } from '../src';
import { DURA_PATCHES_SYMBOL } from '@dura/utils';
import { compose } from 'redux';

let name = 'default';
const deloy = (ms: number) =>
  new Promise((resolve, reject) => setTimeout(resolve, ms));
const user = defineStoreSlice({
  namespace: 'user',
  state: {
    /** 姓名 */
    name: '张三',
  },
  reducers: {
    onChangeName(state, action) {
      state.name = action.payload.name;
    },
  },
  effects: {
    async onAsyncQuery(action) {
      name = action.payload.name;
      await deloy(500);
    },
  },

  watchs: {
    async hello0(state, prevState) {
      console.log(state.name);
    },

    hello: {
      handler: async function (state, prevState) {
        console.log(state.name);
      },
      immediate: true,
    },
  },
});

const order = defineStoreSlice({
  namespace: 'order',
  state: {
    id: 12,
  },
  reducers: {
    onChangeId(state, action: { payload: { name: string } }) {
      return { ...state, name: action?.payload?.name };
    },
  },
});

describe('test dura-core', function () {
  it('test create store', function () {
    const createStore = configura();
    const store = createStore(user);
    expect(store.getState().user).toEqual({
      name: '张三',
      [DURA_PATCHES_SYMBOL]: [],
    });
  });

  it('test onChangename', function () {
    const createStore = configura();
    const store = createStore(user);

    expect(store.getState().user.name).toEqual('张三');

    store.actions.user.onChangeName({ name: 'xx' });

    expect(store.getState().user.name).toEqual('xx');
  });

  it('test not exits async', function () {
    const createStore = configura();
    const store = createStore(user);

    expect(name).toEqual('default');

    store.dispatch({ type: 'user1/onAsyncQuery11' });

    expect(name).toEqual('default');
  });

  it('test async', function () {
    const createStore = configura();
    const store = createStore(user);

    expect(name).toEqual('default');

    store.actions.user.onAsyncQuery({ name: 'xx' });

    expect(name).toEqual('xx');
  });

  it('test use', function () {
    const createStore = configura();
    let store = createStore(user);
    let nextStore = store.use(order).refresh('order');
    expect(nextStore.getState().order.id).toEqual(12);
  });

  it('test repeated use', function () {
    const createStore = configura();
    const store = createStore(user);
    expect(() => store.use(user)).toThrow();
  });

  it('test unUse', function () {
    const createStore = configura();
    const store = createStore(user, order);
    expect(store.getState().user.name).toEqual('张三');
    expect(store.actions.order).toBeDefined();
    const nextStore = store.unUse(user).refresh('user');
    expect(nextStore.getState()['user']).toBeUndefined();
    expect(store.getState()['user']).toBeUndefined();
    expect(nextStore.actions['user']).toBeUndefined();
    expect(store.actions['user']).toBeUndefined();
  });

  it('test actions', function () {
    const createStore = configura();
    const store = createStore(user, order);
    expect(store.actions.user).not.toBeUndefined();
    expect(store.actions.order).not.toBeUndefined();
  });

  it('test preloadedState', function () {
    const createStore = configura({
      preloadedState: {
        user: {
          name: 'default',
        },
      },
    });
    const store = createStore(user);
    expect(store.getState().user.name).toEqual('default');
  });

  it('test compose', function () {
    const createStore = configura({
      compose: compose,
    });
    const store = createStore(user);
    expect(store.getState().user.name).toEqual('张三');
  });

  it('test middlewares', function () {
    const middleware1 = (store) => (next) => (action) => {
      action.payload.name = `middleware1${action.payload.name}`;
      return next(action);
    };

    const createStore = configura({
      middlewares: [middleware1],
    });
    const store = createStore(user);
    expect(store.getState().user.name).toEqual('张三');
    store.actions.user.onChangeName({ name: 'xx' });

    expect(store.getState().user.name).toEqual('middleware1xx');
  });

  it('test enhancers', function () {
    function autoLogger() {
      return (createStore) => (reducer, initialState) => {
        const store = createStore(reducer, initialState);
        function dispatch(action) {
          action.payload.name = `enhancers1${action.payload.name}`;
          const res = store.dispatch(action);
          return res;
        }
        return { ...store, dispatch };
      };
    }

    const createStore = configura({
      enhancers: [autoLogger()],
    });
    const store = createStore(user);
    expect(store.getState().user.name).toEqual('张三');
    store.actions.user.onChangeName({ name: 'x' });
    expect(store.getState().user.name).toEqual('enhancers1x');
  });

  it('test enhancers and middlewares', function () {
    const middleware1 = (store) => (next) => (action) => {
      action.payload.name = `middleware1${action.payload.name}`;
      return next(action);
    };
    function autoLogger() {
      return (createStore) => (reducer, initialState) => {
        const store = createStore(reducer, initialState);
        function dispatch(action) {
          action.payload.name = `enhancers1${action.payload.name}`;
          const res = store.dispatch(action);
          return res;
        }
        return { ...store, dispatch };
      };
    }
    const createStore = configura({
      enhancers: [autoLogger()],
      middlewares: [middleware1],
    });
    const store = createStore(user);
    expect(store.getState().user.name).toEqual('张三');
    store.actions.user.onChangeName({ name: 'x' });
    expect(store.getState().user.name).toEqual('enhancers1middleware1x');
  });
});
