const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const config = require('../../config')

class CampaignService {
    static ENCRYPTION_KEY = config.campaign.tokenGenerationSalt;
    static TOKEN_LENGTH = 20;

    /**
     * Convert random bytes to base36 string
     * @private
     */
    static randomBase36(length) {
        const bytes = crypto.randomBytes(length);
        return Array.from(bytes)
            .map(byte => byte.toString(36).padStart(2, '0'))
            .join('')
            .slice(0, length);
    }

    /**
     * Generate a secure and unique campaign token
     * @param {number} userId - The user ID to include in the token
     * @returns {string} - The 20-character token
     */
    static generateToken(userId) {
        // console.log('Generating token for userId:', userId);
        
        // Create a random position (0-14) to insert userId
        const position = crypto.randomInt(0, 15);
        // console.log('Position:', position);
        
        // Convert userId to base36 and pad to 4 chars
        const userIdBase36 = userId.toString(36).padStart(4, '0');
        // console.log('UserId in base36:', userIdBase36);
        
        // Generate random prefix and suffix in base36
        const prefix = this.randomBase36(position);
        const suffix = this.randomBase36(20 - position - 4);
        
        // Combine all parts and ensure exactly 20 chars
        const token = (prefix + userIdBase36 + suffix).slice(0, 19) + position.toString(36);
        // console.log('Generated token:', token);
        
        return token;
    }

    /**
     * Decode a token to extract the user ID
     * @param {string} token - The token to decode
     * @returns {Object} - Decoded data including userId, or null if invalid
     */
    static decodeToken(token) {
        // console.log('Decoding token:', token);
        
        if (!this.verifyToken(token)) {
            // console.log('Token verification failed');
            return null;
        }

        try {
            // Get position from last char
            const position = parseInt(token.slice(19), 36);
            // console.log('Position:', position);
            
            // Extract userId (4 chars)
            const userIdBase36 = token.slice(position, position + 4);
            // console.log('UserId in base36:', userIdBase36);
            
            // Convert back to number from base36
            const userId = parseInt(userIdBase36, 36);
            // console.log('Decoded userId:', userId);

            return {
                userId,
                isValid: true
            };
        } catch (error) {
            console.error('Decode error:', error);
            return null;
        }
    }

    /**
     * Verify if a token is valid
     * @param {string} token - The token to verify
     * @returns {boolean} - Whether the token is valid
     */
    static verifyToken(token) {
        if (!token || token.length !== this.TOKEN_LENGTH) {
            return false;
        }

        // Check if last char is valid base36
        const position = parseInt(token.slice(19), 36);
        return !isNaN(position) && position >= 0 && position < 15;
    }
}

module.exports = CampaignService;