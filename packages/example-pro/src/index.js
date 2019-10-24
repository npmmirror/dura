"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_dom_1 = require("react-dom");
var react_redux_1 = require("react-redux");
var store_1 = require("./store");
var Home_1 = __importDefault(require("./container/Home"));
react_dom_1.render(<div>
    <react_redux_1.Provider store={store_1.store}>
      <Home_1.default />
    </react_redux_1.Provider>
  </div>, document.querySelector('#root'));
//# sourceMappingURL=index.js.map