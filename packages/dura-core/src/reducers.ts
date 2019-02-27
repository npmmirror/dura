import { handleActions } from "redux-actions";
import { ReducersMapObject } from "redux";
import { Model } from "@dura/types";
import _ from "lodash";
/**
 * 提取reducers
 * @param name
 * @param model
 */
export default function extractReducers<S>(name: string, model: Model<S>): ReducersMapObject {
  const { reducers } = model;
  return {
    [name]: handleActions(
      _.keys(reducers)
        .map((reducerKey: string) => ({ [`${name}/${reducerKey}`]: reducers[reducerKey] }))
        .reduce(_.merge, {}),
      model.state
    )
  };
}
