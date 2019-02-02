import { Plugin, RootModel, Model, ExtractRootState } from "@dura/types";
export declare const createSelectorsPlugin: () => Plugin<any>;
export declare type SelectorsDuraStore<RM extends RootModel<SelectorModel> = any> = {
    selectorRunner: ExtractRootSelectorRunner<RM>;
};
declare type Selectors = {
    [name: string]: any;
};
declare type SelectorModel = {
    selectors?: Selectors;
} & Model;
declare type ExtractSelectorRunner<S extends Selectors, M extends RootModel> = {
    [key in keyof S]: (state: ExtractRootState<M>) => S[key];
};
export declare type ExtractRootSelectorRunner<M extends RootModel<SelectorModel>> = {
    [key in keyof M]: ExtractSelectorRunner<M[key]["selectors"], M>;
};
export {};
