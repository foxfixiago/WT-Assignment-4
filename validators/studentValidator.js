"use strict";
const { body, param, validationResult } = require("express-validator");
const { readAll } = require("../store");

const COURSES = ["Computer Engineering", "IT", "Mechanical", "Electronics", "Civil"];

/* Validation chains (express-validator). Each chain: validators + sanitizers.
   .bail() stops a chain at its first failure so each field shows one clear message. */
const studentRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required.").bail()
    .isLength({ min: 3, max: 50 }).withMessage("Name must be 3 to 50 characters.").bail()
    .matches(/^[A-Za-z][A-Za-z .'-]*$/).withMessage("Name can contain only letters, spaces, dots, apostrophes and hyphens."),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required.").bail()
    .isEmail().withMessage("Enter a valid email address.").bail()
    .customSanitizer(v => v.toLowerCase())
    // custom validator: reject duplicates by checking existing data
    .custom(value => {
      if (readAll().some(s => s.email === value)) throw new Error("This email is already registered.");
      return true;
    }),

  body("mobile")
    .trim()
    .notEmpty().withMessage("Mobile number is required.").bail()
    .matches(/^[6-9]\d{9}$/).withMessage("Mobile must be a 10-digit Indian number starting with 6, 7, 8 or 9."),

  body("age")
    .trim()
    .notEmpty().withMessage("Age is required.").bail()
    .isInt({ min: 17, max: 60 }).withMessage("Age must be a whole number between 17 and 60.")
    .toInt(),

  body("course")
    .isIn(COURSES).withMessage("Please select a valid course."),

  body("city")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 30 }).withMessage("City must be 30 characters or fewer.").bail()
    .matches(/^[A-Za-z .-]+$/).withMessage("City can contain only letters, spaces, dots and hyphens.")
];

const idRule = [ param("id").isAlphanumeric().withMessage("Invalid student id.") ];

/* Middleware that turns validationResult into one 400 response: { errors: { field: message } } */
function handleValidation(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = {};
  result.array().forEach(e => { if (!errors[e.path]) errors[e.path] = e.msg; });
  return res.status(400).json({ errors });
}

module.exports = { studentRules, idRule, handleValidation, COURSES };
