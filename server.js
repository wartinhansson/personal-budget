const express = require("express");
const { envelopesRouter } = require("./envelopes");
const app = express();

// Use envelopesRouter on /envelopes
app.use("/envelopes", envelopesRouter);

// Test get
app.get("/", (req, res, next) => {
  res.send("Hello, World!");
});

// Start server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
