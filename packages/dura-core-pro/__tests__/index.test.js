import {createDuraCorePro} from '../src/index'


describe('dura-core-pro', function () {

    it('dd', function () {

        const defaultModel = {
            namespace: 'default',
            initialState: {
                name: '张三'
            }
        }, default2Model = {
            namespace: 'default2',
            initialState: {
                name: '张三2'
            }
        };

        const duraCorePro = createDuraCorePro({
            initialModels: [defaultModel]
        })

        console.log("初始化", duraCorePro.getState())

        duraCorePro.addModel(default2Model).refresh()

        console.log("新增了default2", duraCorePro.getState())

        duraCorePro.delModel("default2").refresh()

        console.log("删除了default2", duraCorePro.getState())

        duraCorePro.destroy().refresh()

        console.log("销毁", duraCorePro.getState())
    })
})