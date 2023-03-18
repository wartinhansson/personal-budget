const envelopes = [];
let envelopeIdCounter = 1;

// Check if envelope is valid
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

// Add to database
const addToDatabase = (instance) => {
  // Add envelope to envelopes array with id
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

module.exports = {
  addToDatabase,
  getAllFromDatabase,
};
