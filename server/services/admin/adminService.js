const jwt = require('jsonwebtoken');
const config = require('../../config');

/**
 * Sign admin login token
 * @param _Admin {AdminModel}
 * @return {object}
 */
const signLoginToken = (_Admin) => {
    return jwt.sign({
        id: _Admin.id,
        email: _Admin.email
    }, config.jwtSecret, {expiresIn: '12h'})
}

module.exports = {signLoginToken};