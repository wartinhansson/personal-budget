const envelopes = [];
const envelopeIdCounter = 1;

// Check if envelope is valid
const isValidEnvelope = (envelope) => {
  // Check if label is string
  envelope.label = envelope.label;
  if (typeof envelope.label !== "string")
    throw new Error("Envelope label must a string.");

  // Check if limit is number
  if (!isNaN(parseFloat(envelope.limit)) && isFinite(envelope.limit)) {
    envelope.limit = Number(envelope.limit);
  } else {
    throw new Error("Envelope limit must be a number.");
  }

  return true;
};

// Add to database
const addEnvelope = (envelope) => {
  // Add envelope to envelopes array with id
  if (isValidEnvelope(envelope)) {
    envelope.id = `${envelopeIdCounter}`;
    envelopes.push(envelope);
    return envelopes[envelopes.length - 1];
  }
};

module.exports = {
  addEnvelope,
};
