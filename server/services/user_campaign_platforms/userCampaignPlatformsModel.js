const Database = require('../../classes/Database');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class UserCampaignPlatformsModel {

    static table = 'user_campaign_platforms';

    constructor(_Platforms) {
        return _Platforms;
    }

    static async findByKeyValue(_key, _value) {
        const [records] = await Database.connection().query(`SELECT * FROM ${UserCampaignPlatformsModel.table} WHERE ${_key} = ?`, [_value]);
        if (records.length > 0) {
            const returnType = [];
            records.forEach(record => {
                returnType.push(new UserCampaignPlatformsModel(record))
            })

            return returnType;
        }
        return null;
    }

    static async getCampaignByIdAndUser(_id, _userId) {
        const [records] = await Database.connection().query(`SELECT * FROM ${UserCampaignPlatformsModel.table} WHERE id = ? AND user_id = ?`, [_id, _userId]);
        if (records.length > 0) {
            const returnType = [];
            records.forEach(record => {
                returnType.push(new UserCampaignPlatformsModel(record))
            })

            return returnType;
        }
        return null;
    }

    /**
     * Find a platform by user ID and platform name
     * @param _userId {number}
     * @param _platformName {string}
     * @returns {Promise<*>}
     */
    static async findOrCreate(_userId, _platformName) {
        try {
            // First try to find existing platform
            const [existingPlatform] = await Database.connection().query(
                `SELECT * FROM ${UserCampaignPlatformsModel.table} WHERE user_id = ? AND name = ?`,
                [_userId, _platformName]
            );

            // If platform exists, return it
            if (existingPlatform && existingPlatform.length > 0) {
                return existingPlatform[0];
            }

            // If platform doesn't exist, create it
            const platformData = {
                user_id: _userId,
                name: _platformName
            };

            const newPlatformId = await UserCampaignPlatformsModel.create(platformData);
            
            // Fetch and return the newly created platform
            const [newPlatform] = await Database.connection().query(
                `SELECT * FROM ${UserCampaignPlatformsModel.table} WHERE id = ?`,
                [newPlatformId]
            );

            return newPlatform[0];
        } catch (error) {
            console.error('Error in findOrCreate:', error);
            throw error;
        }
    }

    /**
     * Handle creating a new campaign platform.
     * @param {Object} _platformData - The platform data
     */
    static async create(_platformData) {
        try {
            // Try to get the favicon URL
            let faviconUrl = null;
            try {
                const platformName = _platformData.name.toLowerCase().trim();
                console.log('Platform name:', platformName);
                
                // Clean the domain name
                const domain = platformName.includes('.') 
                    ? platformName 
                    : `${platformName}.com`;
                
                console.log('Domain:', domain);
                const url = `https://${domain}`;
                console.log('URL:', url);
                
                // Try to fetch the favicon from common locations
                const possibleFaviconUrls = [
                    `${url}/favicon.ico`,
                    `${url}/favicon.png`,
                    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
                    `https://${domain}/apple-touch-icon.png`,
                    `https://${domain}/apple-touch-icon-precomposed.png`
                ];

                // Try each URL until we find one that works
                for (const possibleUrl of possibleFaviconUrls) {
                    try {
                        const response = await fetch(possibleUrl, {
                            method: 'HEAD',
                            timeout: 5000
                        });
                        
                        if (response.ok) {
                            _platformData.favicon_url = possibleUrl;
                            break;
                        }
                    } catch (error) {
                        console.log(`Failed to fetch favicon from ${possibleUrl}:`, error.message);
                    }
                }

                // If no favicon found, use Google's service as fallback
                if (!_platformData.favicon_url) {
                    console.log('Using Google favicon service as fallback');
                    _platformData.favicon_url = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
                }
            } catch (error) {
                console.error('Error in favicon fetch process:', error);
            }

            // Build the SQL query dynamically based on the keys in _platformData
            const fields = Object.keys(_platformData).join(', ');
            const placeholders = Object.keys(_platformData).map(() => '?').join(', ');
            const values = Object.values(_platformData);

            // Run the query to insert the new platform
            const [result] = await Database.connection().query(
                `INSERT INTO ${UserCampaignPlatformsModel.table} (${fields}) VALUES (${placeholders})`,
                values
            );

            // Return the ID of the newly created platform
            return result.insertId;
        }
        catch (error) {
            console.error('Error creating platform:', error);
            throw error;
        }
    }

    /**
     * Delete platform by ID and user ID
     * @param _id {number} - The campaign id
     * @param _userId {number} - The user id
     * @returns {Promise<boolean>} - Returns true if campaign was deleted, false if campaign was not found
     */
    static async delete(_id, _userId) {
        const [result] = await Database.connection().query(
            `DELETE FROM ${UserCampaignPlatformsModel.table} WHERE id = ? AND user_id = ?`,
            [_id, _userId]
        );

        return result.affectedRows > 0;
    }
}

module.exports = UserCampaignPlatformsModel;