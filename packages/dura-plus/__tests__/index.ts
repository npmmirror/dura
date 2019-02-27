import { create } from "../src";
import { ExtractActions } from "@dura/actions";
import {
  Config as _Config,
  Model,
  Middleware,
  Store,
  RootModel,

  UnionToIntersection
} from "@dura/types";

describe("测试plus", function() {
  it("简单的测试", function() {
    const plugins = {
      loadingPlugin: {
        extraModels: {
          loading: {
            state: {
              loadingState: undefined
            },
            reducers: {
              onChangeLoad(state, action) {
                return state;
              }
            },
            effects: {}
          }
        }
      },
      immerPlugin: {
        extraModels: {
          immer: {
            state: {
              immerState: undefined as string
            },
            reducers: {
              onChangeLoad(state, action) {
                return state;
              }
            },
            effects: {}
          }
        }
      }
    };

    type L<F extends { [name: string]: { extraModels?: RootModel } }> = { [key in keyof F]: F[key]["extraModels"] };

    type S = L<typeof plugins>;

    type Merge<U> = { [key in keyof U]: U[key] };

    type N = Merge<UnionToIntersection<S[keyof S]>>;

    let fn: ExtractActions<N>;

    fn.immer.onChangeLoad;

    const store = create({
      initialModel: {
        user: {
          state: {
            name: undefined
          },
          reducers: {
            onChangeLoad(state, action) {
              return state;
            }
          },
          effects: {}
        }
      },
      plugins
    });
  });

  

});
