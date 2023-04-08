const express = require("express");
const { envelopesRouter } = require("./routes/envelopes");
const { transfersRouter } = require("./routes/transfers");
const app = express();
const bodyParser = require("body-parser");

// Use body parser to JSON
app.use(bodyParser.json());

// Use envelopesRouter on /envelopes
app.use("/envelopes", envelopesRouter);

// Use transfersRouter on /transfers
app.use("/transfers", transfersRouter);

// Error handler
app.use("/", (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).send(err.message);
});

// Start server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
