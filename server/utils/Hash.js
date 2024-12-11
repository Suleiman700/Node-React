const bcrypt = require('bcrypt');

class Hash {
    constructor() {}

    static async hash(_string) {
        return await bcrypt.hash(_string, 10);
    }

    static async validateHash(_string, _hash) {
        return await bcrypt.compare(_string, _hash);
    }

}

module.exports = Hash;