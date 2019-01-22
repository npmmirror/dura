"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dura_1 = __importDefault(require("./dura"));
function default_1(config) {
    return new dura_1.default(config).createDuraStore();
}
exports.default = default_1;
//# sourceMappingURL=index.js.map