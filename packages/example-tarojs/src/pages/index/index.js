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
Object.defineProperty(exports, "__esModule", { value: true });
var taro_1 = require("@tarojs/taro");
var components_1 = require("@tarojs/components");
var redux_1 = require("@tarojs/redux");
var index_1 = require("../../store/index");
require("./index.scss");
// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion
function mapState(state) {
    return {
        count: state.count.count || 0,
        loading: state.loading.count.onAsyncChangeCount
    };
}
function mapDispatch(dispatch) {
    return {
        onPlus: function () {
            dispatch(index_1.actionCreator.count.onChangeCount({ count: 1 }));
        },
        onMin: function () {
            dispatch(index_1.actionCreator.count.onChangeCount({ count: -1 }));
        },
        onAsyncPlus: function () {
            dispatch(index_1.actionCreator.count.onAsyncChangeCount({ count: 1 }, { loading: true }));
        }
    };
}
var Index = /** @class */ (function (_super) {
    __extends(Index, _super);
    function Index() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * 指定config的类型声明为: Taro.Config
         *
         * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
         * 对于像 navigationBarTextStyle:1 'black' 这样的推导出的类型是 string
         * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
         */
        _this.config = {
            navigationBarTitleText: "首页"
        };
        return _this;
    }
    Index.prototype.componentWillReceiveProps = function (nextProps) {
        console.log(this.props, nextProps);
    };
    Index.prototype.componentWillUnmount = function () { };
    Index.prototype.componentDidShow = function () { };
    Index.prototype.componentDidHide = function () { };
    Index.prototype.render = function () {
        console.log(this.props);
        return (<components_1.View className="index">
        <components_1.Button className="add_btn" onClick={this.props.onPlus}>
          +
        </components_1.Button>
        <components_1.Button className="dec_btn" onClick={this.props.onMin}>
          -
        </components_1.Button>
        <components_1.Button className="dec_btn" loading={this.props.loading} onClick={this.props.onAsyncPlus}>
          async
        </components_1.Button>
        <components_1.View>
          <components_1.Text>{this.props.count}</components_1.Text>
        </components_1.View>
        <components_1.View>
          <components_1.Text>Hello, World</components_1.Text>
        </components_1.View>
      </components_1.View>);
    };
    return Index;
}(taro_1.Component));
// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion
exports.default = redux_1.connect(mapState, mapDispatch)(Index);
//# sourceMappingURL=index.js.map