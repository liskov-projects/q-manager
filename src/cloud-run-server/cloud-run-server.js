import express from "express";

const app = express();

const PORT = process.env.PORT || 4000;

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/", (req, res) => {
  res.status(200).send("Hello from the simple test server!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Test server is running on port ${PORT}`);
});
