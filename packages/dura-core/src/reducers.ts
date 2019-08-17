import { handleActions } from "redux-actions";
import { ReducersMapObject } from "redux";
import { Model } from "@dura/types";
import {keys,merge} from "lodash";
/**
 * 提取reducers
 * @param name
 * @param model
 */
export default function extractReducers<S>(name: string, model: Model<S>): ReducersMapObject {
  const { reducers } = model;
  return {
    [name]: handleActions(
      keys(reducers)
        .map((reducerKey: string) => ({ [`${name}/${reducerKey}`]: reducers[reducerKey] }))
        .reduce(merge, {}),
      model.state
    )
  };
}
