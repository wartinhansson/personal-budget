const express = require("express");
const envelopesRouter = express.Router();
const {
  addToDatabase,
  getAllFromDatabase,
  getFromDatabaseById,
  updateInstanceInDatabase,
  deleteInstanceFromDatabase,
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

// Get all budget envelopes
envelopesRouter.get("/", (req, res, next) => {
  res.send(getAllFromDatabase());
});

// Get a budget envelope
envelopesRouter.get("/:envelopeId", (req, res, next) => {
  res.send(req.envelope);
});

// Create budget envelope
envelopesRouter.post("/", (req, res, next) => {
  try {
    const envelope = addToDatabase(req.body);
    res.status(201).send(envelope);
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

// Update a budget envelope
envelopesRouter.put("/:envelopeId", (req, res, next) => {
  const updatedInstance = updateInstanceInDatabase(req.envelope, req.body);
  res.send(updatedInstance);
});

// Delete a budget envelope
envelopesRouter.delete("/:envelopeId", (req, res, next) => {
  const deleted = deleteInstanceFromDatabase(req.envelope);
  if (deleted) res.status(204).send();
});

module.exports = {
  envelopesRouter,
};
