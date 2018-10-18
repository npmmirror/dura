const _ = require('lodash')

console.log(
    _.merge(
        {
            a: {
                add: [12]
            }
        },
        {
            a: {
                add: [56]
            }
        }
    )
)


