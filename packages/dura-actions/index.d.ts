import { ModelMap, ReducerMap, EffectMap, AnyAction } from "@dura/core";

export type ExtractReducerActions<R extends ReducerMap> = {
  [key in keyof R]: Parameters<R[key]>[1] extends undefined
    ? () => AnyAction
    : Parameters<R[key]>[2] extends undefined
    ? (payload: Parameters<R[key]>[1]) => AnyAction
    : (
        payload: Parameters<R[key]>[1],
        meta: Parameters<R[key]>[2]
      ) => AnyAction;
};

export type ExtractEffectActions<E extends EffectMap> = {
  [key in keyof E]: Parameters<E[key]>[0] extends undefined
    ? () => AnyAction
    : Parameters<E[key]>[1] extends undefined
    ? (payload: Parameters<E[key]>[0]) => AnyAction
    : (
        payload: Parameters<E[key]>[0],
        meta: Parameters<E[key]>[1]
      ) => AnyAction;
};

export type ExtractActions<M extends ModelMap> = {
  [key in keyof M]: ExtractReducerActions<ReturnType<M[key]["reducers"]>> &
    ExtractEffectActions<ReturnType<M[key]["effects"]>>;
};

export type ActionCreator = <M extends ModelMap>(m: M) => ExtractActions<M>;

export const createActions: ActionCreator;
