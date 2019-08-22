import * as tslib_1 from "tslib";
const initialState = {};
export default {
    state: initialState,
    reducers: {},
    effects: {
        pushUserPage(effectApi, action) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                console.log(action.payload.navigation);
                action.payload.navigation.push('User');
            });
        }
    }
};
