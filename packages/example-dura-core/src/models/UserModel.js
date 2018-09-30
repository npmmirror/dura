export default {
    namespace: "user",
    initialState: {
        name: "张三",
        age: 12
    },
    reducers: {
        onChangeName: function (state, action) {
            return ({...state, name: action?.payload?.name})
        }
    },
    effects: {}
}