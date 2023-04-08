const express = require("express");
const envelopesRouter = express.Router();
const {
  addToDatabase,
  getAllFromDatabase,
  getFromDatabaseById,
  updateInDatabase,
  deleteFromDatabase,
} = require("../db/db.js");
const statement = {
  table: "envelopes",
  columns: ["envelope_label", "envelope_limit"],
  id: "envelope_id",
};

// Check envelopeId Middleware
envelopesRouter.param("envelopeId", async (req, res, next, envelopeId) => {
  // Statement values
  statement.values = [envelopeId];

  // Find in database
  const envelope = await getFromDatabaseById(statement);

  // If match then set req.envelope to match and go next
  if (envelope) {
    req.envelope = envelope;
    next();
  } else {
    // Else send envelope not found
    res.status(404).send("Envelope not found.");
  }
});

// Check envelope_label and envelope_limit Middleware
const CheckBodyMiddleware = (req, res, next) => {
  const label = req.body["envelope_label"];
  const limit = req.body["envelope_limit"];

  // Check if limit is less than zero
  if (limit < 0) {
    res.status(400).send("envelope_limit must be greater than 0");
    return;
  }

  // If both label and limit exist then set req parameters and next
  if (label && limit) {
    req.label = label;
    req.limit = limit;

    next();
  } else {
    // Else send bad request
    res
      .status(400)
      .send("Request body must contain envelope_label and envelope_limit");
  }
};

// Get all budget envelopes
envelopesRouter.get("/", async (req, res, next) => {
  // Get all envelopes from database
  const envelopes = await getAllFromDatabase(statement);

  res.send(envelopes);
});

// Get a budget envelope
envelopesRouter.get("/:envelopeId", (req, res, next) => {
  res.send(req.envelope);
});

// Create budget envelope
envelopesRouter.post("/", CheckBodyMiddleware, async (req, res, next) => {
  // Statement values
  statement.values = [req.label, req.limit];

  // Add to database
  const envelope = await addToDatabase(statement);

  res.status(201).send(envelope);
});

// Update a budget envelope
envelopesRouter.put(
  "/:envelopeId",
  CheckBodyMiddleware,
  async (req, res, next) => {
    // Statement values
    statement.values = [req.label, req.limit, req.envelope["envelope_id"]];

    // Update in database
    const updatedEnvelope = await updateInDatabase(statement);

    res.send(updatedEnvelope);
  }
);

// Delete a budget envelope
envelopesRouter.delete("/:envelopeId", async (req, res, next) => {
  // Delete envelope from database
  const deleted = await deleteFromDatabase(statement);

  if (deleted) res.sendStatus(204);
});

module.exports = {
  envelopesRouter,
};
