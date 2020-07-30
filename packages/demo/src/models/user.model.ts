
import faker from 'faker'
import { times } from 'lodash'
// faker.setLocale('zh_CN')
faker.locale = 'zh_CN'

const users = times(1000).map(n => ({
    id:n,
    name: `${faker.name.firstName()}${faker.name.lastName()}`,
    city: faker.address.city(),
    streetAddress: faker.address.streetAddress()
}))



export default {
    namespace:"user" as const,
    state:{
        users
    },
    reducers:{
        push(state){
            state.users[999].name = "xx"+Math.random()
        }
    },
    effects:{}
}