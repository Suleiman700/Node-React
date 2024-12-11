const Database = require('../../classes/Database');

class UserModel {

    static table = 'users';

    constructor(_Admin) {
        const {id, name, email, password} = _Admin;
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    /**
     * Find record by email
     * @param _email {string}
     * @return {Promise<{}|null>}
     */
    static async findByEmail(_email) {
        const [rows] = await Database.connection().query(`SELECT * FROM ${UserModel.table} WHERE email = ?`, [_email]);
        if (rows.length > 0) {
            const admin = rows[0];
            return new UserModel(admin);
        }
        return null;
    }

    static async findByKeyValue(_key, _value) {
        const [rows] = await Database.connection().query(`SELECT * FROM ${UserModel.table} WHERE ${_key} = ?`, [_value]);
        if (rows.length > 0) {
            const admin = rows[0];
            return new UserModel(admin);
        }
        return null;
    }
}

module.exports = UserModel;