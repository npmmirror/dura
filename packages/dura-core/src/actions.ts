import { ModelMap, Model } from "@dura/types";
import _ from "lodash";
import { createAction } from "redux-actions";

export default function extractActions<RM extends ModelMap>(models: RM) {
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
