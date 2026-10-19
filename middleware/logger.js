"use strict";
// Custom middleware: logs every request with its final status code and time taken.
module.exports = function logger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start} ms)`);
  });
  next();
};
