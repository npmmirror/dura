export const ACTION_TYPE_SEP = '/';

export const UPDATE_LOADING_REDUCER_NAME = '@@DURA_UPDATE_LOADING';

export const SET_STATE_NAME = '@@DURA_SET_STATE';

export const STATE_LOADING_MAPPING_KEY = '@@DURA_LOADING';

export function createActionType(namespace: string, funcName: string) {
  return `${namespace}${ACTION_TYPE_SEP}${funcName}`;
}

export function createReducerName(funcPrototypeName: string, count: number) {
  return (
    funcPrototypeName || `@@DURA_REDUCER_${(count = (count + 1) % 1_000_000)}`
  );
}

export function createEffectName(funcPrototypeName: string, count: number) {
  return (
    funcPrototypeName || `@@DURA_EFFECT_${(count = (count + 1) % 1_000_000)}`
  );
}
