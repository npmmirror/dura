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
function recursiveEnhanceFun(funArray, targetFun, ...args) {
    const first = funArray.shift();
    if (first) {
        return recursiveEnhanceFun(funArray, first(targetFun, ...args))
    }
    return targetFun;
}


export default recursiveEnhanceFun