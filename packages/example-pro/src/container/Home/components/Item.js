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
var lodash_1 = require("lodash");
var mapState = function (state, ownProps) {
    return {
        item: state.hello.articleList.find(function (n) { return n.id === +ownProps.id; })
    };
};
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Item.prototype.render = function () {
        console.log('item render', this.props.item);
        return (<div>
        <h1>{lodash_1.get(this.props, 'item.title', '')}</h1>
        <span>{lodash_1.get(this.props, 'item.context', '')}</span>
      </div>);
    };
    return Item;
}(react_1.Component));
var ItemContainer = react_redux_1.connect(mapState, null)(Item);
exports.default = ItemContainer;
//# sourceMappingURL=Item.js.map