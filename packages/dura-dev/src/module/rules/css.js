
export default {
    test: /\.css$/,
    use: [{
        loader:'style-loader'
    }, {
        loader:'css-loader'
    }]
}