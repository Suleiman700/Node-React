const bcrypt = require('bcrypt');

class User {
  constructor(id, username, passwordHash) {
    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async validatePassword(password) {
    return await bcrypt.compare(password, this.passwordHash);
  }
}

module.exports = User;
