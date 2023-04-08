const { Pool } = require("pg");
require("dotenv").config();
const pool = new Pool({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
});

// Add instance to database
const addToDatabase = async (statement) => {
  let valueCounter = 1;
  // Build query
  let query = `INSERT INTO ${statement.table} (`;
  for (let i = 0; i < statement.columns.length; i++) {
    if (i === statement.columns.length - 1)
      query += `${statement.columns[i]}) `;
    else query += `${statement.columns[i]}, `;
  }
  query += "VALUES (";
  for (let i = 0; i < statement.values.length; i++) {
    if (i === statement.values.length - 1)
      query += `$${valueCounter}) RETURNING *`;
    else query += `$${valueCounter}, `;

    valueCounter++;
  }

  // Query database
  const { rows } = await pool.query(query, statement.values);

  return rows[0];
};

// Get all from database
const getAllFromDatabase = async (statement) => {
  const query = `SELECT * FROM ${statement.table} ORDER BY ${statement.id} ASC`;
  const { rows } = await pool.query(query);

  return rows;
};

// Get instance from database with ID
const getFromDatabaseById = async (statement) => {
  const query = `SELECT * FROM ${statement.table} WHERE ${statement.id} = $1`;
  const { rows } = await pool.query(query, statement.values);

  return rows[0];
};

// Update an instance in database
const updateInDatabase = async (statement) => {
  let valueCounter = 1;
  // Build query
  let query = `UPDATE ${statement.table} SET `;
  for (let i = 0; i < statement.columns.length; i++) {
    if (statement.columns.length - 1 === i)
      query += `${statement.columns[i]} = $${valueCounter} `;
    else query += `${statement.columns[i]} = $${valueCounter}, `;

    valueCounter++;
  }
  query += `WHERE ${statement.id} = $${valueCounter} RETURNING *`;

  // Query database
  const { rows } = await pool.query(query, statement.values);

  return rows[0];
};

// Delete from database by id
const deleteFromDatabase = async (statement) => {
  const query = `DELETE FROM ${statement.table} WHERE ${statement.id} = $1`;
  const { rows } = await pool.query(query, statement.values);

  if (rows) return true;

  return false;
};

module.exports = {
  addToDatabase,
  getAllFromDatabase,
  getFromDatabaseById,
  updateInDatabase,
  deleteFromDatabase,
};
