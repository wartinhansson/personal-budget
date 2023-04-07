const { Pool } = require("pg");
require("dotenv").config();
const pool = new Pool({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
});

// Add instance to database
const addToDatabase = async (instance) => {
  const label = instance["envelope_label"];
  const limit = instance["envelope_limit"];
  const query =
    "INSERT INTO envelopes (envelope_label, envelope_limit) VALUES ($1, $2) RETURNING *";
  const { rows } = await pool.query(query, [label, limit]);

  return rows;
};

// Get all from database
const getAllFromDatabase = async () => {
  const query = "SELECT * FROM envelopes ORDER BY envelope_id ASC";
  const { rows } = await pool.query(query);

  return rows;
};

// Get instance from database with ID
const getFromDatabaseById = async (envelope_id) => {
  const query = "SELECT * FROM envelopes WHERE envelope_id = $1";
  const { rows } = await pool.query(query, [envelope_id]);

  return rows[0];
};

// Update an instance in database
const updateInstanceInDatabase = async (instance, parameters) => {
  const label = parameters["envelope_label"];
  const limit = parameters["envelope_limit"];
  const id = instance["envelope_id"];
  const query =
    "UPDATE envelopes SET envelope_label = $1, envelope_limit = $2 WHERE envelope_id = $3 RETURNING *";
  const { rows } = await pool.query(query, [label, limit, id]);

  return rows;
};

// Delete from database by id
const deleteInstanceFromDatabase = async (instance) => {
  const id = instance["envelope_id"];
  const query = "DELETE FROM envelopes WHERE envelope_id = $1";
  const { rows } = await pool.query(query, [id]);

  if (rows) return true;

  return false;
};

module.exports = {
  addToDatabase,
  getAllFromDatabase,
  getFromDatabaseById,
  updateInstanceInDatabase,
  deleteInstanceFromDatabase,
};
