const pool = require('../config/db');

async function createUser(fullName, email, hashedPassword) {
  const [result] = await pool.query(
    'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
    [fullName, email, hashedPassword]
  );
  return result.insertId;
}

async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function findUserById(id) {
  const [rows] = await pool.query(
    'SELECT id, full_name, email, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
}

module.exports = { createUser, findUserByEmail, findUserById };
