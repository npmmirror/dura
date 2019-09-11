import UserModel from '@models/UserModel';

import { create, ExtractState } from '@dura/plus';
import { createImmerPlugin } from '@dura/immer';
import { createLoadingPlugin, ExtractLoadingState } from '@dura/loading';
import createActions from '@dura/actions';
import HelloModel from './container/Home/models/HelloModel';

const initialModel = {
  /**
   * 用户模块
   */
  user: UserModel,
  hello: HelloModel
};

export type RootModel = typeof initialModel;

export type RootState = ExtractState<RootModel> &
  ExtractLoadingState<RootModel>;

export const store = create(
  {
    initialModel: initialModel,
    compose: window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']
  },
  {
    immer: createImmerPlugin(),
    loading: createLoadingPlugin(initialModel)
  }
);

const actionCreator = createActions(initialModel);

export { actionCreator };
