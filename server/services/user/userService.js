const mysql = require('mysql2/promise');
const config = require('../config');

// Create a connection pool
const pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  port: config.database.port,
});

// Function to get all users
async function getAllUsers() {
  const [rows] = await pool.query('SELECT * FROM users');
  return rows;
}

// Function to find a user by username
async function findUserByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    return new User(user.id, user.username, user.passwordHash);
  }
  return null;
}

module.exports = {
  getAllUsers,
  findUserByUsername,
};
