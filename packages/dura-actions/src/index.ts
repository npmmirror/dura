import { RootModel, Model, ReducerMap, Pack, EffectMap } from "@dura/types";
import { createAction } from "redux-actions";
import _ from "lodash";

function actionCreator<S extends RootModel>(rootModel: S): ExtractActions<S> {
  return extractActions(rootModel);
}

function extractActions<RM extends RootModel>(models: RM) {
  return _.keys(models)
    .map((name: string) => extractAction(name, models[name]))
    .reduce(_.merge, {});
}

function extractAction(name: string, model: Model<any>) {
  const { reducers, effects } = _.cloneDeep(model);
  return {
    [name]: _.keys(_.merge(reducers, effects))
      .map((reducerKey: string) => ({
        [reducerKey]: createAction(`${name}/${reducerKey}`, payload => payload, (payload, meta) => meta)
      }))
      .reduce(_.merge, {})
  };
}

type ExtractActions<M extends RootModel> = ExtractReducerActions<M> & ExtractEffectActions<M>;

type ExtractReducerActions<M extends RootModel> = {
  [key in keyof M]: ReviewReducders<M[key]["reducers"], M[key]["state"]>
};

type ReviewReducders<R extends ReducerMap<S>, S> = { [key in keyof R]: Pack<Parameters<R[key]>[1]> };

type ExtractEffectActions<M extends RootModel> = {
  [key in keyof M]: "effects" extends keyof M[key] ? ReviewEffects<M[key]["effects"]> : never
};

type ReviewEffects<E extends EffectMap> = { [key in keyof E]: Pack<Parameters<E[key]>[1]> };

export { actionCreator };
