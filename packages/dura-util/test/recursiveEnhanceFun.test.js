import {recursiveEnhanceFun, objectReduce, arrayReduce} from '../src'

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

        const target = recursiveEnhanceFun(funArray, targetFunc, 1, 2, 3);

        expect(target()).toEqual([1, 2, 3])

    });

    it('object reduce', function () {

        const prev = {
            id: 1
        }, next = {
            name: '张三'
        }

        expect(
            objectReduce(prev, next)
        ).toEqual({
            id: 1,
            name: '张三'
        })

    });

    it('array reduce', function () {

        const prev = [1], next = [2]

        expect(
            arrayReduce(prev, next)
        ).toEqual([1,2])

    });

})