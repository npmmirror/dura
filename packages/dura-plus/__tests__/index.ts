import { create } from "../src";
import { Config as _Config, Model, Middleware, Store, RootModel, ExtractRootState } from "@dura/types";

describe("测试plus", function() {
  it("简单的测试", function(done) {
    const plugins = [
      {
        name: "loading",
        extraModels: {
          loading: {
            state: {
              nameLoading: undefined
            },
            reducers: {},
            effects: {}
          }
        }
      },
      {
        name: "immer",
        extraModels: {
          immer: {
            state: {
              nameLoading: undefined as string
            },
            reducers: {},
            effects: {}
          }
        }
      }
    ];

    type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

    const store = create({
      initialModel: {
        user: {
          state: {
            name: undefined
          },
          reducers: {},
          effects: {}
        }
      },
      plugins
    });

    store.startStore();

    store.getActionCreator();
  });
});
