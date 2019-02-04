import { Plugin, RootModel, Model, ExtractRootState } from "@dura/types";
export declare const createSelectorsPlugin: () => Plugin<any>;
export declare type SelectorsDuraStore<RM extends RootModel<SelectorModel & Model> = any> = {
    selectorRunner: ExtractRootSelectorRunner<RM>;
};
declare type Selectors = {
    [name: string]: any;
};
export declare type SelectorModel = {
    selectors?: Selectors;
};
declare type ExtractSelectorRunner<S extends Selectors, M extends RootModel> = {
    [key in keyof S]: (state: ExtractRootState<M>) => S[key];
};
export declare type ExtractRootSelectorRunner<M extends RootModel<SelectorModel & Model>> = {
    [key in keyof M]: ExtractSelectorRunner<M[key]["selectors"], M>;
};
export {};
