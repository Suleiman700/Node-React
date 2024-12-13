const Database = require('../../classes/Database');

class LeadModel {

    static table = 'leads';

    constructor(_Lead) {
        return _Lead;
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
     * @returns {Promise<Array<LeadModel>>} Array of LeadModel instances
     */
    static async findByKeyValue(key, value) {
        try {
            const [rows] = await Database.connection().query(
                `
                SELECT
                    leads.*,
                    campaigns.name AS campaign_name,
                    campaigns.platform AS campaign_platform,
                    user_campaign_platforms.favicon_url AS campaign_platform_favicon_url
                FROM ${LeadModel.table} AS leads
                         LEFT JOIN campaigns
                           ON leads.campaign_id = campaigns.id
                         LEFT JOIN user_campaign_platforms
                           ON user_campaign_platforms.name = campaigns.platform
                WHERE leads.${key} = ?
            `,
                [value]
            );

            if (rows.length) {
                // Convert rows to instances of LeadModel
                return rows.map(row => new LeadModel(row));
            }
            else {
                return null;
            }
        }
        catch (error) {
            // console.error('Error finding leads by key-value:', error);
            throw null;
        }
    }

    /**
     * Delete lead by ID and user ID
     * @param _id {number} - The lead id
     * @param _userId {number} - The user id
     * @returns {Promise<boolean>} - Returns true if read was deleted, false if lead was not found
     */
    static async delete(_id, _userId) {
        const [result] = await Database.connection().query(
            `DELETE FROM ${LeadModel.table} WHERE id = ? AND user_id = ?`,
            [_id, _userId]
        );

        return result.affectedRows > 0;
    }
}

module.exports = LeadModel;