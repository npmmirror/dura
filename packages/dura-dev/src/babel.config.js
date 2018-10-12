function getBabelConfig({}) {
    return {
        presets: [
            [
                "@babel/preset-env",
                {
                    targets: "> 0.25%, not dead"
                }
            ]
        ],
        plugins: [
            "@babel/plugin-syntax-dynamic-import",
            "@babel/plugin-transform-react-jsx",
            [
                "@babel/plugin-transform-runtime",
                {
                    corejs: false,
                    helpers: false,
                    regenerator: true,
                    useESModules: false
                }
            ]
        ]
    }
}

export default getBabelConfig