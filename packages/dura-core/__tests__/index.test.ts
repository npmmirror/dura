import { create, actions } from "../src/index";
import { IPlugin, IModel, DuraState } from "../src/typings";

describe("dd", function() {
  interface EModel extends IModel {
    effects: () => object;
  }

  it("dd", function() {
    const user = {
      name: "user",
      state: {
        name: undefined,
        sex: undefined
      },
      reducers: {
        onChangeName(state, action) {
          state.name = action.payload.name;
        }
      },
      effects: {
        async onAsyncChangeName({ dispatch, action }) {

          dispatch({
            type: "user.onChangeName",
            payload: action.payload
          });
          console.log("onAsyncChangeName");
        }
      }
    };
    const store = create({
      models: {
        user
      },
      initialState: { user: { name: undefined, sex: "男" } },
      plugins: [],
      middlewares: []
    });

    // const stu = {
    //   name: "stu",
    //   state: {
    //     age: undefined
    //   },
    //   reducers: {
    //     onChange(state) {
    //       return state;
    //     }
    //   }
    // };

    // // actions([user]).user.onChangeName(store.dispatch, { name: "张三" });

    // const f = () => ({
    //   user:user
    // })

    // const res = f();

    // const state: DuraState<typeof res> = store.getState();

    // typeof console.log(store.getState());

    // store.dispatch({
    //   type: "user.onAsyncChangeName",
    //   payload: {
    //     name: "哈哈"
    //   }
    // });

    // console.log(store.getState());
  });
});
