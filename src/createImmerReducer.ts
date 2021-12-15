import { Action, Reducer } from 'redux';
import { AkOptions } from './types';
import { Patch, applyPatches } from 'immer';
import { __COMMIT__, __PATCHES__ } from './internal/const';
export interface AkAction extends Action<string> {
  payload?: {
    patches?: Patch[];
  };
}

export function createImmerReducer<S extends Record<string, unknown>>(
  options: AkOptions,
): Reducer<S> {
  function immerReducer(state: S = options.initialState, action: AkAction) {
    const [$namespace, $name] = action?.type?.split?.('/');
    if ($namespace !== options.namespace) {
      return state;
    }

    if (($name as string).startsWith(`${__COMMIT__}`)) {
      const nextState = applyPatches(state, action?.payload?.patches ?? []);

      return nextState;
    }

    return state;
  }

  return immerReducer;
}
