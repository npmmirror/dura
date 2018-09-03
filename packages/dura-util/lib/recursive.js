"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * 递归增强函数
 *
 *
 * const funArray = [
 *      function(targetFun , args){
 *          console.log("A")
 *          return targetFun
 *      },
 *      function(targetFun, args){
 *          console.log("B)
 *          return targetFun
 *      }
 * ]
 *
 * const targetFun = function(){
 *  console.log("targetFun")
 * }
 *
 * const newFun = recursiveEnhanceFun(funArray , targetFun)
 *
 * newFun()
 *
 * // 打印结果
 * // A
 * // B
 * // targetFun
 *
 *
 * @param funArray
 * @param targetFun
 * @param args 参数
 */
function recursiveEnhanceFun(funArray, targetFun) {
  var first = funArray.shift();

  if (first) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return recursiveEnhanceFun(funArray, first.apply(void 0, [targetFun].concat(args)));
  }

  return targetFun;
}

var _default = recursiveEnhanceFun;
exports.default = _default;