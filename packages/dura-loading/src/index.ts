export default {
  name: "loading",
  model: {
    state: {},
    reducers: {
      onChangeLoading(state, action) {
        return {
          ...state,
          [action.payload.name]: {
            [action.payload.fnName]: action.payload.loading
          }
        };
      }
    }
  },
  wrapModel: model => model,
  intercept: {
    pre: action => action && action.meta && action.meta.loading,
    before: (action, dispatch) => {
      const [name, fnName] = action.type.split("/");
      dispatch.loading.onChangeLoading({ name, fnName, loading: true });
    },
    after: (action, dispatch) => {
      const [name, fnName] = action.type.split("/");
      dispatch.loading.onChangeLoading({ name, fnName, loading: false });
    }
  }
};
