/**
 * 自动loading
 */
import { ModelMap, Model, EffectApi, ExcludeTypeAction, Plugin, EffectMap } from "@dura/types";

import _ from "lodash";

export const createLoadingPlugin = function<MM extends ModelMap>(modelMap: MM): Plugin {
  return {
    onEffect: (name, effect) => {

      

      return effect;
    }
  };
};

function extractLoadingModelInitialStateByEffect<S extends Model<any>>(
  model: S
): { [k in keyof S["effects"]]: boolean } {
  return _.keys(model.effects || {})
    .map((effectName: string) => ({ [effectName]: false }))
    .reduce(_.merge, {});
}

type ConvertFnToBoolean<E extends EffectMap> = { [key in keyof E]: boolean };

export type ExtractLoadingState<RMT extends ModelMap> = {
  loading: { [key in keyof RMT]: ConvertFnToBoolean<RMT[key]["effects"]> };
};

export type LoadingMeta = {
  loading?: boolean;
};
