import {
  createStore,
  combineReducers,
  compose,
  applyMiddleware,
  ReducersMapObject
} from 'redux';
import { create } from '../src/store';

const initialState = () => ({
  /**
   * 姓名
   */
  name: '默认姓名' as string,
  /**
   * 性别
   */
  sex: undefined as '男' | '女',
  /**
   * 年龄
   */
  age: undefined as number
});

const UserModel = {
  name: () => <const>'user',
  state: () => initialState(),
  reducers: () => ({
    /**
     *
     * @param payload 同步修改姓名
     */
    onChangeName(state, payload: { newS: string }) {
      console.log('hello');
      state.name = payload.newS;
      return state;
    }
  }),
  effects: () => ({
    async onAsyncChangeName(
      payload: { newName: string },
      meta: { loading: boolean }
    ) {}
  })
};

let a: ReturnType<typeof UserModel.name>;

const JobModel = {
  name: () => <const>'job',
  state: () => initialState(),
  reducers() {
    return {
      /**
       *
       * @param payload 同步修改姓名
       */
      onChangeName(state, payload: { newS: string }) {
        state.name = payload.newS;
        return state;
      }
    };
  },
  effects() {
    return {
      async onAsyncChangeName(
        payload: { newName: string },
        meta: { loading: boolean }
      ) {}
    };
  }
};

describe('测试', function() {
  it('dd', function() {
    const store = create({
      models: [JobModel, UserModel]
    });

    console.log(store.getState());

    store.dispatch({
      type: 'user/onChangeName',
      payload: {
        newS: 'hello'
      }
    });

    console.log(store.getState());
  });
});
