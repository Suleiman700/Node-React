const Database = require('../../classes/Database');

class CampaignsModel {

    static table = 'campaigns';

    constructor(_Campaign) {
        const {id, user_id, name, token, active, created_at} = _Campaign;
        this.id = id;
        this.user_id = user_id;
        this.name = name;
        this.token = token;
        this.active = active;
        this.created_at = created_at
    }

    static async findByKeyValue(_key, _value) {
        const [records] = await Database.connection().query(`SELECT * FROM ${CampaignsModel.table} WHERE ${_key} = ?`, [_value]);
        if (records.length > 0) {
            const returnType = [];
            records.forEach(record => {
                returnType.push(new CampaignsModel(record))
            })

            return returnType;
        }
        return null;
    }
}

module.exports = CampaignsModel;