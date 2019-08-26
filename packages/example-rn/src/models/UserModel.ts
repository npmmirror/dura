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
  state: initialState,
  reducers: {
    /**
     *
     * @param payload 同步修改姓名
     */
    onChangeName(
      state: State,
      action: { payload: { newName: string } }
    ): State {
      state.name = action.payload.newName;
      return state;
    },
    onChangeContext(state: State, action: { payload: { newContext: string } }) {
      state.context = action.payload.newContext;
      return state;
    }
  },
  effects: {
    /**
     * 异步修改姓名
     * @param payload
     */
    async onAsyncChangeName(
      effectApi: EffectApi,
      action: { payload: { newName: string }; meta: { loading: boolean } }
    ) {
      await effectApi.delay(2000);
      effectApi.dispatch(actionCreator.user.onChangeName(action.payload));
    }
  }
};
