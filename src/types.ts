import { ComponentClass } from 'react';
import { Store } from 'redux';
import ts from 'ts-toolbelt';
export type GetStateFn<S> = () => S;

export type SetStateFnArg<S> = (state: S) => void;

export type SetStateFn<S> = (arg: SetStateFnArg<S>) => void;

export type FireDeclaration<S> = (
  setState: SetStateFn<S>,
  getState: GetStateFn<S>,
) => ts.F.Function;

export type Selector<S, R> = (state: S) => R;

export type ConfigureOptions = {
  onError?: (error: Error) => void;
};

export type AkOptions = {
  namespace: string;
  initialState: ts.O.Object;
};

export type StoreManager = {
  has: () => boolean;
  del: () => void;
  add: () => void;
  refresh: () => void;
  reduxStore: Store;
};

export type Api = {
  configureOptions: ConfigureOptions;
  isRefreshing: () => boolean;
  setState: SetStateFn<ts.F.Function>;
  getState: GetStateFn<ts.O.Object>;
  akOptions: AkOptions;
  storeManager: StoreManager;
};

export interface UseStateFn<S> {
  (): S;
  <SS>(selector: (state: S) => SS): SS;
}

export interface ConnectReturn {
  <P, CS>(UserComponent: ComponentClass<P, CS>): ComponentClass<P, CS>;
}

export interface MapStateToProps<S, R> {
  (state: S): R;
}

export interface MapSetStateToProps<S, R> {
  (setState: SetStateFn<S>): R;
}

export interface MergeProps<P1, P2, P3 = ts.O.Object, R = unknown> {
  (stateProps?: P1, setStateProps?: P2, props?: P3): R;
}
export interface Connect {
  (mount: boolean): ConnectReturn;
  (
    mount: boolean,
    mapStateToProps?: ts.F.Function,
    mapSetStateToProps?: ts.F.Function,
    mergeProps?: ts.F.Function,
  ): ConnectReturn;
}

export type StoreEnhancerExt = {
  createAk: <S>(options: {
    namespace: string;
    initialState: S;
  }) => {
    defineFire: <F extends FireDeclaration<S>>(
      fireDeclaration: F,
    ) => ReturnType<F>;
    useMount: () => void;
    useState: UseStateFn<S>;
    useSetState: () => SetStateFn<S>;
    UNSAFE_setState: SetStateFn<S>;
    UNSAFE_getState: GetStateFn<S>;
    connect: Connect;
  };
};

export type ClassPropsType<
  CreateAkReturn extends ts.F.Return<StoreEnhancerExt['createAk']>,
  S = ts.F.Return<CreateAkReturn['UNSAFE_getState']>
> = {
  [K in keyof S]: S[K];
} & {
  setState: CreateAkReturn['UNSAFE_setState'];
};
