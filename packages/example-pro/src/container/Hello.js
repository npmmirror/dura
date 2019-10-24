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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_redux_1 = require("react-redux");
var lodash_1 = require("lodash");
var Hello = /** @class */ (function (_super) {
    __extends(Hello, _super);
    function Hello(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            answer: {}
        };
        return _this;
    }
    Hello.prototype.componentWillMount = function () { };
    Hello.prototype.componentDidMount = function () { };
    Hello.prototype.render = function () {
        var name1 = lodash_1.get(this.state, 'answer.orderNo.projectName', '默认');
        return (<div>
        <h1>人员列表</h1>
        <h1>{name1}</h1>
      </div>);
    };
    return Hello;
}(react_1.default.Component));
exports.default = react_redux_1.connect()(Hello);
//# sourceMappingURL=Hello.js.map