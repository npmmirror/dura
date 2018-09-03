import recursiveEnhanceFun from '../src/recursive'

describe('recursiveEnhanceFun', () => {


    it('recursiveEnhanceFun', function () {

        const targetFunc = function (...args) {
            return args
        }


        const funArray = [function (target, ...args) {
            return function () {
                return target(...args)
            }
        }, function (target, ...args) {
            return function () {
                return target(...args)
            }
        }]

        const target = recursiveEnhanceFun(funArray, targetFunc,1,2,3);

        expect(target()).toEqual([1,2,3])

    });

})