import { defineStoreSlice, configura } from '../src';
let name = 'default';
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

const deloy = (ms: number) =>
  new Promise((resolve, reject) => setTimeout(resolve, ms));

describe('test core loading', function () {
  it('test customize loading', function (done) {
    const createStore = configura();
    const store = createStore(user);

    const id = 11;

    store.actions.user.onAsyncQuery(null, {
      loading: {
        customizeId: id,
      },
    });
    expect(
      store.getState().DURA.LOADING.user.onAsyncQuery.customize[id].status,
    ).toBeTruthy();

    setTimeout(() => {
      expect(
        store.getState().DURA.LOADING.user.onAsyncQuery.customize[id].status,
      ).toBeFalsy();
      done();
    }, 501);
  });

  it('test loading', function (done) {
    const createStore = configura();
    const store = createStore(user);

    store.actions.user.onAsyncQuery(null, { loading: true });
    expect(store.getState().DURA.LOADING.user.onAsyncQuery.status).toBeTruthy();
    setTimeout(() => {
      expect(
        store.getState().DURA.LOADING.user.onAsyncQuery.status,
      ).toBeFalsy();
      done();
    }, 501);
  });
});
