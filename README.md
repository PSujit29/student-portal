# Student Portal (Backend)

This is my personal learning project: a backend for a college **student portal + simple LMS**. I am using it to understand how real-world systems handle authentication, roles, admission workflows, and basic student management.

## What I Am Trying to Learn

- How to structure a Node.js/Express project in a clean, modular way
- How authentication works in practice (JWT, middleware, role-based access)
- How real colleges might handle admission and student accounts
- How to design data models for users, applicants, admissions, and later courses/LMS

## Current Scope (MVP Backend)

Right now I am focused on a small but realistic MVP, not on building everything at once.

- **Authentication & Accounts**

  - User registration with hashed passwords (bcrypt)
  - Email-style activation using a separate activation token
  - Login that returns a JWT access token
  - Auth middleware to protect routes and check user roles

- **Admission / Applicant Flow (Design + Models)**

  - `User` model with roles (applicant, student, teacher, admin)
  - `Applicant` model linked to a user for admission details
  - `Admission` model for application status (under review, approved, rejected)
  - MVP admission flow written down in `admission.txt` and partially implemented

- **Validation & Error Handling**

  - Request body validation using Joi
  - Central error-handling middleware with consistent JSON responses

- **Simple Frontend for Testing**
  - Minimal HTML pages served from `public/` to test register and login

## Tech Stack

- Runtime: Node.js
- Framework: Express 5
- Database: MongoDB with Mongoose
- Auth: JSON Web Tokens (JWT)
- Validation: Joi
- Password hashing: bcryptjs
- Email: Nodemailer (through a small mail service)

## Project Structure (High Level)

- `index.js` – server entry point
- `src/config` – app, express, MongoDB, and constants configuration
- `src/router` – route definitions (auth, student, admission, etc.)
- `src/controllers` – request handlers and business logic
- `src/models` – Mongoose models (User, Applicant, Admission, ...)
- `src/middlewares` – auth, validation, error handling, upload
- `src/services` – mail and other services
- `public/` – very simple HTML pages for manual testing

## How to Run (Development)

1. Install dependencies:
   - `npm install` **or** `pnpm install`
2. Create a `.env` file with the required environment variables (MongoDB URI, JWT secrets, mail config, etc.).
3. Start the server in development mode:
   - `npm run dev` **or** `pnpm run dev`

The default entry file is `index.js`.

## Roadmap (What I Plan Next)

- Finish the full applicant admission flow (apply, review, approve/reject)
- Add basic student portal views (profile, notices, simple dashboard)
- Start very small LMS features (courses, assignments, submissions)
- Improve documentation as the project grows

This project is mainly for learning and experimentation, so the design may change as I understand more about real college workflows and backend best practices.
