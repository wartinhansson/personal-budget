const { Pool } = require("pg");
require("dotenv").config();
const pool = new Pool({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
});

let balance = 0;
const envelopes = [];
let envelopeIdCounter = 1;

// Check if instance is valid envelope
const isValidEnvelope = (instance) => {
  // Check if label is string
  if (typeof instance.label !== "string")
    throw new Error("Envelope label must a string.");

  // Check if limit is number
  if (!isNaN(parseFloat(instance.limit)) && isFinite(instance.limit)) {
    instance.limit = Number(instance.limit);
  } else {
    throw new Error("Envelope limit must be a number.");
  }

  return true;
};

// Add instance to database
const addToDatabase = async (instance) => {
  if (isValidEnvelope(instance)) {
    const { label, limit } = instance;
    const query =
      "INSERT INTO envelopes (envelope_label, envelope_limit) VALUES ($1, $2) RETURNING *";

    const { rows } = await pool.query(query, [label, limit]);

    return rows;
  }
};

// Get all from database
const getAllFromDatabase = async () => {
  const query = "SELECT * FROM envelopes ORDER BY envelope_id ASC";
  const { rows } = await pool.query(query);

  return rows;
};

// Get instance from database with ID
const getFromDatabaseById = async (id) => {
  const query = "SELECT * FROM envelopes WHERE envelope_id = $1";
  const { rows } = await pool.query(query, [id]);

  return rows;
};

// Update an instance in database
const updateInstanceInDatabase = (instance, parameters) => {
  const index = envelopes.findIndex((element) => element.id === instance.id);

  if (isValidEnvelope(instance)) {
    const { label, limit } = parameters;

    envelopes[index].label = label;
    envelopes[index].limit = limit;

    return envelopes[index];
  }
};

// Delete from database by id
const deleteInstanceFromDatabase = (instance) => {
  const index = envelopes.findIndex((element) => element.id === instance.id);

  if (index !== -1) {
    envelopes.splice(index, 1);
    return true;
  } else {
    return false;
  }
};

module.exports = {
  addToDatabase,
  getAllFromDatabase,
  getFromDatabaseById,
  updateInstanceInDatabase,
  deleteInstanceFromDatabase,
};
