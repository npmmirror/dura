import React from 'react'
import {render} from 'react-dom'
import {createDuraCore} from 'dura-core/lib'

const duraStore = createDuraCore()

console.log(duraStore)

console.log("12")


render(<h1>hello</h1>, document.querySelector("#root"))