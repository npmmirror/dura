import typeScript from './typeScript'
import javaScript from './javaScript'
import css from './css'
import file from './file'
import url from './url'

import 'style-loader'

export default function (userConfig) {
    return ([
        css,
        file,
        url,
        javaScript,
        typeScript,
    ])
}