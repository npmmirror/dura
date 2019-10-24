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
var react_native_1 = require("react-native");
var react_redux_1 = require("react-redux");
var store_1 = require("./store");
var LoginContainer_1 = __importDefault(require("./container/LoginContainer"));
var react_navigation_1 = require("react-navigation");
var react_native_2 = require("@ant-design/react-native");
var AppContainer = react_navigation_1.createNavigationContainer(react_navigation_1.createDrawerNavigator({
    Home: {
        screen: LoginContainer_1.default
    },
    Setting: function () {
        return (<react_native_1.View>
            <react_native_1.Text>hello</react_native_1.Text>
          </react_native_1.View>);
    }
}, {
    drawerBackgroundColor: 'rgba(255,255,255,.9)',
    contentOptions: {
        activeTintColor: '#fff',
        activeBackgroundColor: '#6b52ae'
    }
}));
var C = react_redux_1.connect(function (state) {
    return {
        isShowDraw: state.user.isShowDraw
    };
}, function (dispatch) {
    return {
        onChangeIsShowDraw: function () {
            dispatch(store_1.actionCreator.user.onChangeIsShowDraw({ isShowDraw: false }));
        }
    };
})(function (props) {
    var sidebar = (<react_native_1.View>
      <react_native_1.Text>hello</react_native_1.Text>
    </react_native_1.View>);
    return (<react_native_2.Drawer drawerWidth={200} sidebar={sidebar} position='left' open={props.isShowDraw} onOpenChange={function (status) {
        if (!status) {
            props.onChangeIsShowDraw({ isShowDraw: false });
        }
    }} drawerBackgroundColor='#ccc'>
      <AppContainer />
    </react_native_2.Drawer>);
});
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.render = function () {
        console.log("\u73AF\u5883\uFF1A" + process.env.NODE_ENV);
        return (<react_redux_1.Provider store={store_1.store}>
        <C />
      </react_redux_1.Provider>);
    };
    return App;
}(react_1.Component));
// console.log("App", App);
exports.default = App;
//# sourceMappingURL=index.js.map