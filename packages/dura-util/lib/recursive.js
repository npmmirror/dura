"use strict";

/**
 * 递归增强函数
 *
 *
 * const funArray = [
 *      function(targetFun){
 *          console.log("A")
 *          return targetFun
 *      },
 *      function(targetFun){
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
 */
function recursiveEnhanceFun(funArray, targetFun) {
  var first = funArray.shift();

  if (first) {
    return recursiveEnhanceFun(funArray, first(targetFun));
  }

  return targetFun;
}

export {
  recursiveEnhanceFun
}