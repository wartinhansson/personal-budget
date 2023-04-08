const express = require("express");
const envelopesRouter = express.Router();
const {
  addToDatabase,
  getAllFromDatabase,
  getFromDatabaseById,
  updateInstanceInDatabase,
  deleteInstanceFromDatabase,
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

const LabelAndLimitMiddleware = (req, res, next) => {
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
envelopesRouter.post("/", LabelAndLimitMiddleware, async (req, res, next) => {
  // Statement values
  statement.values = [req.label, req.limit];

  // Add to database
  const envelope = await addToDatabase(statement);

  res.status(201).send(envelope);
});

// Transfer value from one envelope to another
envelopesRouter.post("/transfer/:from/:to", async (req, res, next) => {
  const query = "SELECT * FROM envelopes WHERE envelope_id = $1";
  const from = await getFromDatabaseById(query, req.params.from);
  const to = await getFromDatabaseById(query, req.params.to);

  if (!from) res.status(404).send("From envelope not found.");
  else if (!to) res.status(404).send("To envelope not found.");

  if (from && to) {
    const amount = Number(req.body.amount);

    if (from["envelope_limit"] - amount < 0) {
      res.status(400).send(`Not enough funds in ${from["envelope_label"]}`);
      return;
    }

    updateInstanceInDatabase(from, {
      ...from,
      envelope_limit: (from["envelope_limit"] -= amount),
    });
    updateInstanceInDatabase(to, {
      ...to,
      envelope_limit: (to["envelope_limit"] += amount),
    });

    res.send(
      `${amount} was transferred from ${from["envelope_label"]} to ${to["envelope_label"]}.`
    );
  }
});

// Update a budget envelope
envelopesRouter.put(
  "/:envelopeId",
  LabelAndLimitMiddleware,
  async (req, res, next) => {
    // Statement values
    statement.values = [req.label, req.limit, req.envelope["envelope_id"]];

    // Update in database
    const updatedInstance = await updateInstanceInDatabase(statement);

    res.send(updatedInstance);
  }
);

// Delete a budget envelope
envelopesRouter.delete("/:envelopeId", async (req, res, next) => {
  // Delete envelope from database
  const deleted = await deleteInstanceFromDatabase(statement);

  if (deleted) res.status(204).send();
});

module.exports = {
  envelopesRouter,
};
