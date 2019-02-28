"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, ms); });
}
exports.delay = delay;
//# sourceMappingURL=util.js.map