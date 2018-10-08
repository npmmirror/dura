const defaultExtensions = ['.js', '.jsx', '.ts', '.tsx', '.json']

export default function (userExtensions) {
    return [...defaultExtensions, ...userExtensions]
}