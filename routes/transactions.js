const express = require("express");
const transactionsRouter = express.Router();
const {
  addToDatabase,
  getAllFromDatabase,
  getFromDatabaseById,
  updateInDatabase,
  deleteFromDatabase,
} = require("../db/db.js");
const statement = {
  table: "transactions",
  columns: [
    "transaction_date",
    "transaction_amount",
    "transaction_from_id",
    "transaction_to_id",
  ],
  id: "transaction_id",
};
const envelopeStatement = {
  table: "envelopes",
  columns: ["envelope_label", "envelope_limit"],
  id: "envelope_id",
};

// Check transactionId Middleware
transactionsRouter.param(
  "transactionId",
  async (req, res, next, transactionId) => {
    // Statement values
    statement.values = [transactionId];

    // Find in database
    const transaction = await getFromDatabaseById(statement);

    // If match then set req.transaction to match and go next
    if (transaction) {
      req.transaction = transaction;
      next();
    } else {
      // Else send transaction not found
      res.status(404).send("Transaction not found.");
    }
  }
);

// Check fromId Middleware
transactionsRouter.param("fromId", async (req, res, next, fromId) => {
  // Statement values
  envelopeStatement.values = [fromId];

  // Find in database
  const envelope = await getFromDatabaseById(envelopeStatement);

  // If match then set req.fromEnvelope to match and go next
  if (envelope) {
    req.fromEnvelope = envelope;
    next();
  } // Else send envelope not found
  else res.status(404).send("Envelope not found.");
});

// Check toId Middleware
transactionsRouter.param("toId", async (req, res, next, toId) => {
  // Statement values
  envelopeStatement.values = [toId];

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
  if (Number(req.body["transaction_amount"]) < 0)
    res.status(400).send("transaction_amount has to be greater than zero");
  else {
    req.amount = req.body["transaction_amount"];
    next();
  }
};

const CheckBodyMiddleware = (req, res, next) => {
  const date = req.body["transaction_date"];
  const amount = req.body["transaction_amount"];

  if (date && amount) {
    req.date = date;
    req.amount = amount;

    next();
  } else
    res
      .status(400)
      .send(
        "Request body must contain transaction_date and transaction_amount"
      );
};

// Get all transactions
transactionsRouter.get("/", async (req, res, next) => {
  // Get all transactions from database
  const transactions = await getAllFromDatabase(statement);

  res.send(transactions);
});

// Get a transaction
transactionsRouter.get("/:transactionId", async (req, res, next) => {
  res.send(req.transaction);
});

// Create a new transaction
transactionsRouter.post(
  "/:fromId/:toId",
  checkAmountMiddleware,
  async (req, res, next) => {
    // Check if transaction_amount is greater than envelope_limit
    if (req.fromEnvelope["envelope_limit"] < req.amount) {
      res
        .status(400)
        .send(
          `transaction_amount is greater than ${req.fromEnvelope["envelope_label"]}'s envelope_limit`
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

    // Update from envelope
    envelopeStatement.values = [
      req.fromEnvelope["envelope_label"],
      req.fromEnvelope["envelope_limit"] - req.amount,
      req.fromEnvelope["envelope_id"],
    ];
    const updatedFromEnvelope = await updateInDatabase(envelopeStatement);

    // Update to envelope
    envelopeStatement.values = [
      req.toEnvelope["envelope_label"],
      req.toEnvelope["envelope_limit"] + req.amount,
      req.toEnvelope["envelope_id"],
    ];
    const updatedToEnvelope = await updateInDatabase(envelopeStatement);

    if (updatedFromEnvelope && updatedToEnvelope) {
      // Statement values
      statement.values = [
        currentDate,
        req.amount,
        req.fromEnvelope["envelope_id"],
        req.toEnvelope["envelope_id"],
      ];

      // Add to database
      const transaction = await addToDatabase(statement);

      res.send(transaction);
    } else res.sendStatus(500);
  }
);

// Update a transaction
transactionsRouter.put(
  "/:transactionId",
  CheckBodyMiddleware,
  checkAmountMiddleware,
  async (req, res, next) => {
    // Statement values
    statement.values = [
      req.date,
      req.amount,
      req.transaction["transaction_from_id"],
      req.transaction["transaction_to_id"],
      req.transaction["transaction_id"],
    ];

    // Update in database
    const updatedTransaction = await updateInDatabase(statement);

    res.send(updatedTransaction);
  }
);

// Delete a transaction
transactionsRouter.delete("/:transactionId", async (req, res, next) => {
  // Delete transaction from database
  const deleted = await deleteFromDatabase(statement);

  if (deleted) res.sendStatus(204);
});

module.exports = {
  transactionsRouter,
};
