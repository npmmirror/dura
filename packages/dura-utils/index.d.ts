export interface DelayFn {
  (ms: number): Promise<void>;
}

export interface MergeFn {
  <P = any, N = any>(prev: P, next: N): {
    [key in keyof P]: P[key];
  } &
    { [key in keyof N]: N[key] };
}

export interface NoopFn {
  (): {};
}

export const delay: DelayFn;

export const merge: MergeFn;

export const noop: NoopFn;
