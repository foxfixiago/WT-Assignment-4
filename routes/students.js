"use strict";
const express = require("express");
const { matchedData } = require("express-validator");
const { readAll, writeAll } = require("../store");
const { studentRules, idRule, handleValidation } = require("../validators/studentValidator");

const router = express.Router();
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// GET /api/students
router.get("/", (req, res) => res.json(readAll()));

// POST /api/students  (validated by middleware before the handler runs)
router.post("/", studentRules, handleValidation, (req, res) => {
  const data = matchedData(req);            // only validated + sanitized fields
  const student = {
    id: newId(),
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    age: data.age,
    course: data.course,
    city: data.city || "",
    registeredOn: new Date().toISOString().slice(0, 10)
  };
  const list = readAll();
  list.push(student);
  writeAll(list);
  res.status(201).json(student);
});

// DELETE /api/students/:id
router.delete("/:id", idRule, handleValidation, (req, res) => {
  const list = readAll();
  const next = list.filter(s => s.id !== req.params.id);
  if (next.length === list.length) return res.status(404).json({ errors: { _form: "Student not found." } });
  writeAll(next);
  res.json({ deleted: req.params.id });
});

module.exports = router;
