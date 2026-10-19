"use strict";
const fs = require("fs");
const path = require("path");
const DATA_FILE = path.join(__dirname, "data.json");

function readAll() {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}
function writeAll(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
}
module.exports = { readAll, writeAll };
