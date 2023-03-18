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
const addToDatabase = (instance) => {
  if (isValidEnvelope(instance)) {
    instance.id = `${envelopeIdCounter++}`;
    envelopes.push(instance);

    return envelopes[envelopes.length - 1];
  }
};

// Get all from database
const getAllFromDatabase = () => {
  return envelopes;
};

// Get instance from database with ID
const getFromDatabaseById = (id) => {
  return envelopes.find((element) => element.id === id);
};

// Update an instance in database
const updateInstanceInDatabase = (instance, id) => {
  const instanceIndex = envelopes.findIndex((element) => element.id === id);

  if (isValidEnvelope(instance)) {
    const { label, limit } = instance;

    envelopes[instanceIndex].label = label;
    envelopes[instanceIndex].limit = limit;

    return envelopes[instanceIndex];
  }
};

module.exports = {
  addToDatabase,
  getAllFromDatabase,
  getFromDatabaseById,
  updateInstanceInDatabase,
};
