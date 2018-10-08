import path from 'path'

const currPath = process.cwd();

export function getAbsPath(targetPath) {
    return path.join(currPath, targetPath)
}