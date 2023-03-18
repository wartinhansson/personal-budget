const envelopes = [];
const nextId = 1;

// Add to database
const addEnvelope = (envelope) => {
  const { label, limit } = envelope;

  // Check if both label and limit included
  if (!label && !limit)
    return new Error("New envelope must include both label and limit.");

  // Check correct type of label and limit
  if (typeof label !== "String")
    return new Error("Label must be of type String.");
  else if (typeof limit !== "Number")
    return new Error("Limit must be of type Number.");

  // Add to array with id
  const newEnvelope = {
    id: nextId,
    ...envelope,
  };

  envelopes.push(newEnvelope);

  // Increase id counter
  nextId++;

  return newEnvelope;
};

module.exports = {
  addEnvelope,
};
