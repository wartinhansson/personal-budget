const express = require("express");
const envelopesRouter = express.Router();
const {
  addToDatabase,
  getAllFromDatabase,
  getFromDatabaseById,
  updateInstanceInDatabase,
  deleteInstanceFromDatabase,
} = require("../db/db.js");

// Check envelopeId Middleware
envelopesRouter.param("envelopeId", async (req, res, next, envelopeId) => {
  const envelope = await getFromDatabaseById(envelopeId);

  if (envelope.length) {
    req.envelope = envelope[0];
    next();
  } else {
    res.status(404).send("Envelope not found.");
  }
});

const LabelAndLimitMiddleware = (req, res, next) => {
  const label = req.body["envelope_label"];
  const limit = req.body["envelope_limit"];

  if (label && limit) next();
  else
    res
      .status(400)
      .send("Request body must contain envelope_label and envelope_limit");
};

// Get all budget envelopes
envelopesRouter.get("/", async (req, res, next) => {
  const envelopes = await getAllFromDatabase();

  res.send(envelopes);
});

// Get a budget envelope
envelopesRouter.get("/:envelopeId", (req, res, next) => {
  res.send(req.envelope);
});

// Create budget envelope
envelopesRouter.post("/", LabelAndLimitMiddleware, async (req, res, next) => {
  const envelope = await addToDatabase(req.body);

  res.status(201).send(envelope);
});

// Transfer value from one envelope to another
envelopesRouter.post("/transfer/:from/:to", (req, res, next) => {
  const from = getFromDatabaseById(req.params.from);
  const to = getFromDatabaseById(req.params.to);

  if (!from) res.status(404).send("From envelope not found.");
  if (!to) res.status(404).send("To envelope not found.");

  const amount = Number(req.query.amount);

  updateInstanceInDatabase(from, {
    ...from,
    limit: (from.limit -= amount),
  });
  updateInstanceInDatabase(to, {
    ...to,
    limit: (to.limit += amount),
  });

  res.send(`${amount} was transferred from ${from.label} to ${to.label}.`);
});

// Update a budget envelope
envelopesRouter.put(
  "/:envelopeId",
  LabelAndLimitMiddleware,
  async (req, res, next) => {
    const updatedInstance = await updateInstanceInDatabase(
      req.envelope,
      req.body
    );

    res.send(updatedInstance);
  }
);

// Delete a budget envelope
envelopesRouter.delete("/:envelopeId", async (req, res, next) => {
  const deleted = await deleteInstanceFromDatabase(req.envelope);

  if (deleted) res.status(204).send();
});

module.exports = {
  envelopesRouter,
};
