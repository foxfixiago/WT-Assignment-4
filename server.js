"use strict";
const express = require("express");
const path = require("path");
const logger = require("./middleware/logger");
const studentRoutes = require("./routes/students");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger);                                   // custom middleware
app.use(express.json({ limit: "50kb" }));          // built-in body parser
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/students", studentRoutes);           // router mounted on a path

// 404 for unknown API routes
app.use("/api", (req, res) => res.status(404).json({ errors: { _form: "Route not found." } }));

// Central error-handling middleware (4 arguments)
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ errors: { _form: "Malformed JSON in request body." } });
  }
  console.error(err);
  res.status(500).json({ errors: { _form: "Internal server error." } });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
