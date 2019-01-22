import create from "../src/index";

describe("dd", function () {
    it("dd", function () {
        const user = {
            name: "user",
            state: {
                name: undefined,
                sex: undefined
            },
            reducers: {
                onChangeName(state, action) {
                    return {...state, name: action.payload.name};
                }
            },
            effects: {
                onAsyncChangeName(store, action) {
                    store.dispatch({type: "user.onChangeName", payload: action.payload});
                    console.log("onAsyncChangeName");
                }
            }
        };
        const store = create({
            models: [user],
            initialState: {user: {name: undefined, sex: "男"}},
            plugins: [],
            middlewares: []
        });

        const stu = {
            name: "stu",
            state: {
                age: undefined
            },
            reducers: {
                onChange(state) {
                    return state;
                }
            }
        };


        const action = store.dispatch({
            type: "user.onChangeName",
            payload: {
                name: "章三"
            }
        });

        console.log(action);

        console.log(store.getState());

        store.models(stu)

        // store.dispatch({
        //     type: "user.clear",
        // });

        console.log(store.getState());

        store.unModels("user")

        console.log(store.getState());

        store.models(user)

        console.log(store.getState());

    });
});
