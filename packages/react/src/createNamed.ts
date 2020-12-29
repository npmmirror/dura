export const ACTION_TYPE_SEP = '/';

export const UPDATE_LOADING_REDUCER_NAME = '@@DURA.UPDATE.LOADING';

export const STATE_LOADING_MAPPING_KEY = '@@DURA.LOADING';

export function createActionType(namespace: string, funcName: string) {
  return `${namespace}${ACTION_TYPE_SEP}${funcName}`;
}

export function createReducerName(funcPrototypeName: string, count: number) {
  return (
    funcPrototypeName || `@@DURA.REDUCER.${(count = (count + 1) % 1_000_000)}`
  );
}

export function createEffectName(funcPrototypeName: string, count: number) {
  return (
    funcPrototypeName || `@@DURA.EFFECT.${(count = (count + 1) % 1_000_000)}`
  );
}
