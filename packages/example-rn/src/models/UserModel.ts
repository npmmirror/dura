import { EffectApi } from '@dura/plus';
import { actionCreator } from '../store';

const initialState = {
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
  age: undefined as number,
  /**
   * 文本内容
   */
  context: ''
};

type State = typeof initialState;

export default {
  state: () => initialState,
  reducers: () => ({
    /**
     *
     * @param payload 同步修改姓名
     */
    onChangeName(state: State, payload: { newName: string }): State {
      state.name = payload.newName;
      return state;
    },
    onChangeContext(state: State, payload: { newContext: string }) {
      state.context = payload.newContext;
      return state;
    }
  }),
  effects: (dispatch, getState, delay) => ({
    /**
     * 异步修改姓名
     * @param payload
     */
    async onAsyncChangeName(
      payload: { newName: string },
      meta: { loading: boolean }
    ) {
      console.log('hello');

      await delay(2000);
      if (payload.newName.indexOf('3') !== -1) {
        throw new Error();
      }

      dispatch(actionCreator.user.onChangeName(payload));
    }
  })
};
