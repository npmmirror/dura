import { Plugin, DuraStore, RootModel, Model, ExtractRootState } from "@dura/types";

const extractSelectors = function(name: string, model) {
  const { selectors = {} } = model;
  return Object.keys(selectors)
    .map((name: string) => ({ [name]: selectors[name]() }))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
};

const createSelectorRunner = function(rootModel: RootModel) {
  const rootModelKeys = Object.keys(rootModel);
  const selectors = rootModelKeys
    .map((name: string) => ({
      [name]: extractSelectors(name, rootModel[name])
    }))
    .reduce((prev, next) => ({ ...prev, ...next }), {});
  return selectors;
};

export const createSelectorsPlugin = function(): Plugin {
  return {
    name: "selectors",
    onStoreCreated(store: DuraStore & SelectorsDuraStore, rootModel: RootModel) {
      store.selectorRunner = createSelectorRunner(rootModel);
    }
  };
};

export type SelectorsDuraStore<RM extends RootModel<SelectorModel & Model> = any> = {
  selectorRunner: ExtractRootSelectorRunner<RM>;
};

type Selectors = {
  [name: string]: any;
};

export type SelectorModel = {
  selectors?: Selectors;
};

type ExtractSelectorRunner<S extends Selectors, M extends RootModel> = {
  [key in keyof S]: ReturnType<S[key]>
};

export type ExtractRootSelectorRunner<M extends RootModel<SelectorModel & Model>> = {
  [key in keyof M]: ExtractSelectorRunner<M[key]["selectors"], M>
};
