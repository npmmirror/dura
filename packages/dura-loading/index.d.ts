import { EffectMap, ModelMap, Plugin } from "@dura/plus";

export type ConvertFnToBoolean<E extends EffectMap> = {
  [key in keyof E]: boolean;
};

export type ExtractLoadingState<RMT extends ModelMap> = {
  loading: {
    [key in keyof RMT]: ConvertFnToBoolean<ReturnType<RMT[key]["effects"]>>;
  };
};

export type LoadingPluginCreator = <MM extends ModelMap>(m: MM) => Plugin;

export const createLoadingPlugin: LoadingPluginCreator;
