const express = require("express");
const envelopesRouter = express.Router();
const { addToDatabase, getAllFromDatabase } = require("./db.js");

// Get all envelopes
envelopesRouter.get("/", (req, res, next) => {
  res.send(getAllFromDatabase());
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
