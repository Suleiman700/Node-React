const Database = require('../../classes/Database');

class LeadModel {

    static table = 'leads';

    constructor(_Lead) {
        const {id, campaign_id, data} = _Lead;
        this.id = id;
        this.campaign_id = campaign_id;
        this.data = data;
    }

    /**
     * Handle creating a new lead.
     * @param {Object} _data - The lead data
     * @param {number} _data.campaignId - The campaign ID this lead belongs to
     * @param {Object} _data.data - The form submission data
     * @returns {Promise<Object>} The created lead record
     */
    static async create(_data) {
        try {
            const { userId, campaignId, data } = _data;

            // Validate required fields
            if (!userId) {
                throw new Error('User ID is required');
            }
            if (!campaignId) {
                throw new Error('Campaign ID is required');
            }

            // Prepare the lead data
            const leadData = {
                user_id: userId,
                campaign_id: campaignId,
                data: JSON.stringify(data),
                created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
            };

            // Insert into database
            const [result] = await Database.connection().query(
                `INSERT INTO ${LeadModel.table} SET ?`,
                [leadData]
            );

            if (!result.insertId) {
                throw new Error('Failed to create lead');
            }

            // Return the created lead
            return {
                id: result.insertId,
                ...leadData,
                data: JSON.parse(leadData.data) // Convert back to object for response
            };
        } catch (error) {
            console.error('Error creating lead:', error);
            throw error;
        }
    }

    /**
     * Find leads by a specific key-value pair
     * @param {string} key - The column name
     * @param {any} value - The value to search for
     * @returns {Promise<Array>} Array of found leads
     */
    static async findByKeyValue(key, value) {
        const [rows] = await Database.connection().query(
            `SELECT * FROM ${LeadModel.table} WHERE ${key} = ?`,
            [value]
        );
        return rows.map(row => ({
            ...row,
            data: JSON.parse(row.data) // Parse the JSON data field
        }));
    }
}

module.exports = LeadModel;