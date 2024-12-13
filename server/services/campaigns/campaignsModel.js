const Database = require('../../classes/Database');

class CampaignsModel {

    static table = 'campaigns';

    constructor(_Campaign) {
        const {id, user_id, name, token, active, created_at, description, platform} = _Campaign;
        this.id = id;
        this.user_id = user_id;
        this.name = name;
        this.token = token;
        this.description = description;
        this.platform = platform;
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

    static async getCampaignByIdAndUser(_id, _userId) {
        const [records] = await Database.connection().query(`SELECT * FROM ${CampaignsModel.table} WHERE id = ? AND user_id = ?`, [_id, _userId]);
        if (records.length > 0) {
            const returnType = [];
            records.forEach(record => {
                returnType.push(new CampaignsModel(record))
            })

            return returnType;
        }
        return null;
    }

    /**
     * Update campaign
     * @param _id {number} - The campaign id
     * @param _data {object}
     * @returns {Promise<void>}
     */
    static async update(_id, _data) {
        try {
            // Build the SQL query dynamically based on the keys in _data
            const fields = Object.keys(_data)
                .map(key => `${key} = ?`)
                .join(', ');

            const values = Object.values(_data);

            // Add the campaign ID to the values array
            values.push(_id);

            // Run the query to update the campaign
            const [result] = await Database.connection().query(
                `UPDATE ${CampaignsModel.table} SET ${fields} WHERE id = ?`,
                values
            );

            // Return a result or confirmation (optional)
            return result.affectedRows > 0;
        }
        catch (error) {
            console.error('Error updating campaign:', error);
            throw error; // Re-throw the error for the caller to handle
        }
    }

    /**
     * Handle creating a new campaign.
     * @param {Object} _campaignData - The campaign data
     */
    static async create(_campaignData) {
        try {
            // Build the SQL query dynamically based on the keys in _campaignData
            const fields = Object.keys(_campaignData).join(', ');
            const placeholders = Object.keys(_campaignData).map(() => '?').join(', ');
            const values = Object.values(_campaignData);

            // Run the query to insert the new campaign
            const [result] = await Database.connection().query(
                `INSERT INTO ${this.table} (${fields}) VALUES (${placeholders})`,
                values
            );

            // Check if a row was inserted and return the new ID
            return result.affectedRows > 0 ? result.insertId : false;
        }
        catch (error) {
            console.error('Error creating campaign:', error);
            throw error; // Re-throw the error for the caller to handle
        }
    }

    /**
     * Delete campaign by ID and user ID
     * @param _id {number} - The campaign id
     * @param _userId {number} - The user id
     * @returns {Promise<boolean>} - Returns true if campaign was deleted, false if campaign was not found
     */
    static async delete(_id, _userId) {
        const [result] = await Database.connection().query(
            `DELETE FROM ${CampaignsModel.table} WHERE id = ? AND user_id = ?`,
            [_id, _userId]
        );

        return result.affectedRows > 0;
    }
}

module.exports = CampaignsModel;