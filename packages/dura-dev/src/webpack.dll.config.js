import path from 'path'
import webpack from 'webpack'

const {DllPlugin} = webpack

function getWebpackDllConfig({dll}) {
    return {
        entry: {
            vendor: [...[], ...dll]
        },
        output: {
            path: path.join(process.cwd(), ".dura"),
            filename: "[name].dll.js"
        },
        plugins: [
            new DllPlugin({
                path: path.join(process.cwd(), ".dura", "[name]-manifest.json"),
                name: "[name]"
            })
        ]
    };
}

export default getWebpackDllConfig;
