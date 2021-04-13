export type ResolveNamespaceFn = (
  namespace: string,
  id?: string | number,
) => string;

export const resolveNamespace: ResolveNamespaceFn = (namespace, id) =>
  [namespace, id].filter((x) => !!x).join('.');
