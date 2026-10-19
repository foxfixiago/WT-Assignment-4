# Student Registration Portal: Server-Side Validation with ExpressJS

A web application built with **Express.js** and **express-validator** that demonstrates **server-side validation**.
The browser only sends raw form input. The server validates every request, rejects invalid data with HTTP 400 and
field-wise error messages, and stores accepted records in a JSON file.

**Course:** 2304362L-SV26-27 | **Assignment:** 4 | **Student:** Om Gupta (PRN: ________)
**Live URL:** (add your deployed link here)
**GitHub:** (add your repository link here)

## Why this is server-side validation

- `public/script.js` contains **no validation rules**. It sends the form values to the API and shows the error messages returned by the server.
- All rules live in `validators/studentValidator.js` and run before the route handler on every `POST /api/students`.
- Invalid requests, even ones sent with curl or Postman that skip the web page, get `400 Bad Request` and nothing is saved.

## Express.js concepts used

| Concept | Where |
|---|---|
| `express.Router()` | `routes/students.js`, mounted at `/api/students` in `server.js` |
| Application-level middleware | `middleware/logger.js` logs every request with status code and time |
| Built-in middleware | `express.json()` for bodies, `express.static()` for the frontend |
| Route-level middleware | `studentRules` and `handleValidation` run before the POST handler |
| express-validator chains | `body()`, `param()`, `.trim()`, `.isEmail()`, `.isInt()`, `.isIn()`, `.matches()`, `.bail()` |
| Custom validator | Duplicate email check using `.custom()` |
| Sanitizers | `.trim()`, `.toInt()`, email lowercased with `.customSanitizer()` |
| Error-handling middleware | 4-argument handler in `server.js` for malformed JSON and server errors |
| REST status codes | 200, 201, 400, 404, 500 |

## Validation rules

| Field | Rules |
|---|---|
| Name | Required, 3 to 50 characters, letters, spaces, dots, apostrophes, hyphens only |
| Email | Required, valid format, converted to lowercase, must not already be registered |
| Mobile | Required, 10-digit Indian number starting with 6, 7, 8 or 9 |
| Age | Required, whole number between 17 and 60 |
| Course | Must be one of Computer Engineering, IT, Mechanical, Electronics, Civil |
| City | Optional, up to 30 characters, letters, spaces, dots, hyphens only |

## API

| Method | Route | Purpose | Responses |
|---|---|---|---|
| GET | `/api/students` | List all students | 200 |
| POST | `/api/students` | Register a student (validated) | 201, 400 |
| DELETE | `/api/students/:id` | Delete a student | 200, 400, 404 |

Error format: `{ "errors": { "email": "Enter a valid email address.", "age": "Age is required." } }`

## Project structure

```
student-registration-express/
├── server.js                    # app setup, middleware, router mounting, error handler
├── store.js                     # read and write data.json
├── routes/
│   └── students.js              # Express Router with the API routes
├── validators/
│   └── studentValidator.js      # express-validator rules and error formatter
├── middleware/
│   └── logger.js                # request logger
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js                # fetch() calls and rendering only
├── package.json
└── README.md
```

## Run locally

```bash
npm install
npm start
```
Open http://localhost:3000

## Test server-side validation with curl

```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"x1","email":"abc","mobile":"12345","age":"abc","course":"Zzz"}'
```
Expected: HTTP 400 with one error message per invalid field.

## Deploy on Render

1. Push this folder to a GitHub repository.
2. On render.com: New, Web Service, connect the repository.
3. Build command: `npm install` | Start command: `npm start` | Instance type: Free
4. Deploy and copy the `onrender.com` URL into this README.

On free hosting the disk is not permanent, so saved records may reset when the service restarts.

## Conclusion

This assignment demonstrated server-side validation using Express.js. The server checks every field with
express-validator chains, applies sanitizers, uses a custom validator to block duplicate emails, and answers
invalid requests with HTTP 400 and clear field-wise messages, so bad data is never stored. Using `express.Router`,
route-level middleware, a custom logger and a central error handler showed how an Express application is organised
into small, reusable parts. Because validation runs on the server, it keeps working even when the web page is
bypassed, which client-side checks alone cannot guarantee.
