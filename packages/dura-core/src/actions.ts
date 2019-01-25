import { IModel } from "./typings";

function actions(models: Array<IModel>) {
  return models.map(model => extractAction(model)).reduce((prev, next) => ({ ...prev, ...next }), {});
}

function extractAction(model: IModel) {
  const nextAction = Object.keys(model.reducers)
    .map((key: string) => ({
      [key]: (dispatch, payload) =>
        dispatch({
          type: `${model.name}.${key}`,
          payload: payload
        })
    }))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
  return { [model.name]: nextAction };
}

export { actions };
