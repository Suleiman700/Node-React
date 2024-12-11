const Database = require('../../classes/Database');

class AdminModel {
    constructor(_Admin) {
        const {id, name, email, password} = _Admin;
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    /**
     * Find admin by email
     * @param _email {string}
     * @return {Promise<{}|null>}
     */
    static async findByEmail(_email) {
        const [rows] = await Database.connection().query('SELECT * FROM admins WHERE email = ?', [_email]);
        if (rows.length > 0) {
            const admin = rows[0];
            return new AdminModel(admin);
        }
        return null;
    }

    static async findByKeyValue(_key, _value) {
        const [rows] = await Database.connection().query(`SELECT * FROM admins WHERE ${_key} = ?`, [_value]);
        if (rows.length > 0) {
            const admin = rows[0];
            return new AdminModel(admin);
        }
        return null;
    }
}

module.exports = AdminModel;