import { ReducersMapObject } from "redux";
import { Model } from "@dura/types";
/**
 * 提取reducers
 * @param name
 * @param model
 */
export default function extractReducers<S>(name: string, model: Model<S>): ReducersMapObject;
