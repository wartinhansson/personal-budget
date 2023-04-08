const express = require("express");
const transfersRouter = express.Router();
const {
  addToDatabase,
  getAllFromDatabase,
  getFromDatabaseById,
  updateInDatabase,
  deleteFromDatabase,
} = require("../db/db.js");
const statement = {
  table: "transfers",
  columns: [
    "transfer_date",
    "transfer_amount",
    "transfer_from_id",
    "transfer_to_id",
  ],
  id: "transfer_id",
};

// Check transferId Middleware
transfersRouter.param("transferId", async (req, res, next, transferId) => {
  // Statement values
  statement.values = [transferId];

  // Find in database
  const transfer = await getFromDatabaseById(statement);

  // If match then set req.transfer to match and go next
  if (transfer) {
    req.transfer = transfer;
    next();
  } else {
    // Else send transfer not found
    res.status(404).send("Transfer not found.");
  }
});

// Check from Middleware
transfersRouter.param("from", async (req, res, next, from) => {
  // Statement values
  const envelopeStatement = {
    table: "envelopes",
    id: "envelope_id",
    values: [from],
  };

  // Find in database
  const envelope = await getFromDatabaseById(envelopeStatement);

  // If match then set req.fromEnvelope to match and go next
  if (envelope) {
    req.fromEnvelope = envelope;
    next();
  } // Else send envelope not found
  else res.status(404).send("Envelope not found.");
});

// Check to Middleware
transfersRouter.param("to", async (req, res, next, to) => {
  // Statement values
  const envelopeStatement = {
    table: "envelopes",
    id: "envelope_id",
    values: [to],
  };

  // Find in database
  const envelope = await getFromDatabaseById(envelopeStatement);

  // If match then set req.fromEnvelope to match and go next
  if (envelope) {
    req.toEnvelope = envelope;
    next();
  } // Else send envelope not found
  else res.status(404).send("Envelope not found.");
});

// Check if amount is valid
const checkAmountMiddleware = (req, res, next) => {
  if (Number(req.body["transfer_amount"]) < 0)
    res.status(400).send("transfer_amount has to be greater than zero");
  else {
    req.amount = req.body["transfer_amount"];
    next();
  }
};

const CheckBodyMiddleware = (req, res, next) => {
  const date = req.body["transfer_date"];
  const amount = req.body["transfer_amount"];

  if (date && amount) {
    req.date = date;
    req.amount = amount;

    next();
  } else
    res
      .status(400)
      .send("Request body must contain transfer_date and transfer_amount");
};

// Get all transfers
transfersRouter.get("/", async (req, res, next) => {
  // Get all transfers from database
  const transfers = await getAllFromDatabase(statement);

  res.send(transfers);
});

// Get a transfer
transfersRouter.get("/:transferId", async (req, res, next) => {
  res.send(req.transfer);
});

// Create a new transfer
transfersRouter.post(
  "/:from/:to",
  checkAmountMiddleware,
  async (req, res, next) => {
    // Check if amount from envelope has required amount
    if (req.fromEnvelope["envelope_limit"] < req.amount) {
      res
        .status(400)
        .send(
          `transfer_amount is greater than ${req.fromEnvelope["envelope_label"]}'s envelope_limit`
        );
      return;
    }

    // Get current date in YYYY-MM-DD
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    const currentDate = `${year}-${month}-${day}`;

    // Statement values
    statement.values = [
      currentDate,
      req.amount,
      req.fromEnvelope["envelope_id"],
      req.toEnvelope["envelope_id"],
    ];

    // Add to database
    const transfer = await addToDatabase(statement);

    res.send(transfer);
  }
);

// Update a transfer
transfersRouter.put(
  "/:transferId",
  CheckBodyMiddleware,
  checkAmountMiddleware,
  async (req, res, next) => {
    // Statement values
    statement.values = [
      req.date,
      req.amount,
      req.transfer["transfer_from_id"],
      req.transfer["transfer_to_id"],
      req.transfer["transfer_id"],
    ];

    // Update in database
    const updatedTransfer = await updateInDatabase(statement);

    res.send(updatedTransfer);
  }
);

// Delete a transfer
transfersRouter.delete("/:transferId", async (req, res, next) => {
  // Delete transfer from database
  const deleted = await deleteFromDatabase(statement);

  if (deleted) res.sendStatus(204);
});

module.exports = {
  transfersRouter,
};
