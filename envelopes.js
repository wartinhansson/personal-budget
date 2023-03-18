const express = require("express");
const envelopesRouter = express.Router();
const {
  addToDatabase,
  getAllFromDatabase,
  getFromDatabaseById,
} = require("./db.js");

// Check envelopeId Middleware
envelopesRouter.param("envelopeId", (req, res, next, envelopeId) => {
  const envelope = getFromDatabaseById(envelopeId);

  if (envelope) {
    req.envelope = envelope;
    next();
  } else {
    res.status(404).send("Envelope not found.");
  }
});

// Get all envelopes
envelopesRouter.get("/", (req, res, next) => {
  res.send(getAllFromDatabase());
});

// Get envelope
envelopesRouter.get("/:envelopeId", (req, res, next) => {
  res.send(req.envelope);
});

// Create budget envelope
envelopesRouter.post("/", (req, res, next) => {
  try {
    // Try to create envelope with req body
    const envelope = addToDatabase(req.body);
    res.status(201).send(envelope);
  } catch (err) {
    // Send to error handler
    err.status = 400;
    next(err);
  }
});

module.exports = {
  envelopesRouter,
};
