const initialState = () => {
  return {
    name: '张三',
    articleList: [
      {
        id: 1,
        title: '文章标题',
        context: '马云退休了'
      },
      {
        id: 2,
        title: '苹果发布会',
        context: '浴霸来了'
      }
    ]
  };
};

type State = ReturnType<typeof initialState>;

const reducers = () => {
  return {
    onChangeName(state: State, payload: { nextName: string }) {
      state.name = payload.nextName;
    },
    onChangeItem(state: State, payload: { id: number; title: string }) {
      const item = state.articleList.find(n => n.id === payload.id);
      item.title = payload.title;
      // state.articleList.push({id:12,title:'测试',context:'测试'})
    }
  };
};

const effects = () => {
  return {};
};

export default {
  state: initialState,
  reducers: reducers,
  effects: effects
};
