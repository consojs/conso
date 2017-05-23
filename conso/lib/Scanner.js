import path from 'path';
export default class Scanner {
    constructor(packageDir) {
        this.packageDir = path.join(process.cwd(), packageDir);

    }
}