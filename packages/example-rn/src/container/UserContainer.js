"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_redux_1 = require("react-redux");
var react_native_1 = require("react-native");
var store_1 = require("../store");
var react_native_2 = require("@ant-design/react-native");
function mapState(state) {
    return {
        name: state.user.name,
        loading: state.loading.user.onAsyncChangeName
    };
}
function mapDispatch(dispatch) {
    return {
        onAsyncChangeName: function () {
            dispatch(store_1.actionCreator.user.onAsyncChangeName({ newName: "async异步张三" }, { loading: true }));
        },
        onChangeName: function () {
            dispatch(store_1.actionCreator.user.onChangeName({ newName: "同步张三" }));
        }
    };
}
var UserContainer = /** @class */ (function (_super) {
    __extends(UserContainer, _super);
    function UserContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserContainer.prototype.render = function () {
        return (<react_native_1.View style={{ flex: 1, paddingTop: 84, backgroundColor: "#fff" }}>
        <react_native_2.Flex>
          <react_native_2.Flex.Item>
            <react_native_1.Text style={{ fontSize: 24 }}>原始数据：</react_native_1.Text>
          </react_native_2.Flex.Item>
          <react_native_2.Flex.Item>
            <react_native_1.Text style={{ fontSize: 18, color: "red" }}>{this.props.name}</react_native_1.Text>
          </react_native_2.Flex.Item>
        </react_native_2.Flex>
      </react_native_1.View>);
    };
    return UserContainer;
}(react_1.Component));
exports.default = react_redux_1.connect(mapState, mapDispatch)(UserContainer);
//# sourceMappingURL=UserContainer.js.map