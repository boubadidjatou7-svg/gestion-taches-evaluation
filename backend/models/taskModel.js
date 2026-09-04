const pool = require('../config/db');

async function getTasksByUser(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows;
}

async function getTaskById(id, userId) {
  const [rows] = await pool.query(
    'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return rows[0];
}

async function createTask(title, description, status, userId) {
  const [result] = await pool.query(
    'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)',
    [title, description, status || 'En attente', userId]
  );
  return result.insertId;
}

async function updateTask(id, userId, { title, description, status }) {
  const [result] = await pool.query(
    'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
    [title, description, status, id, userId]
  );
  return result.affectedRows;
}

async function deleteTask(id, userId) {
  const [result] = await pool.query(
    'DELETE FROM tasks WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return result.affectedRows;
}

module.exports = { getTasksByUser, getTaskById, createTask, updateTask, deleteTask };
