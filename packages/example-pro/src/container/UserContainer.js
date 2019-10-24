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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_redux_1 = require("react-redux");
var antd_1 = require("antd");
var _store_1 = require("@store");
var Hello_1 = __importDefault(require("./Hello"));
function mapState(state) {
    return {
        name: state.user.name,
        loading: state.loading.user.onAsyncChangeName
    };
}
function mapDispatch(dispatch) {
    return {
        onAsyncChangeName: function (newName) {
            dispatch(_store_1.actionCreator.user.onAsyncChangeName({ newName: newName }, { loading: true }));
        },
        onChangeName: function (newName) {
            dispatch(_store_1.actionCreator.user.onChangeName({ newName: newName }));
        }
    };
}
var UserContainer = /** @class */ (function (_super) {
    __extends(UserContainer, _super);
    function UserContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserContainer.prototype.render = function () {
        var _this = this;
        return (<div>
        <h1>{this.props.name}</h1>
        <antd_1.Input value={this.props.name} onChange={function (e) { return _this.props.onChangeName(e.target.value); }}/>
        <antd_1.Button loading={this.props.loading} type='primary' onClick={function () { return _this.props.onAsyncChangeName(_this.props.name); }}>
          提交
        </antd_1.Button>
        <Hello_1.default />
      </div>);
    };
    return UserContainer;
}(react_1.Component));
exports.default = react_redux_1.connect(mapState, mapDispatch)(UserContainer);
//# sourceMappingURL=UserContainer.js.map