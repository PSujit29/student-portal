# Student Portal (Backend‑First)

This is my personal learning project: a **backend‑first** MERN backend for a college‑style student portal. It is **not** a finished LMS; the goal is to learn realistic backend architecture (auth, roles, admission flows, student domain) before building any serious frontend.

## What I Am Trying to Learn

- How to structure a Node.js/Express project in a clean, modular way
- How authentication works in practice (JWT, middleware, role-based access)
- How real colleges might handle admission and student accounts
- How to design data models for users, applicants, admissions, and later courses/LMS

## Current Scope (MVP Backend)

Right now the focus is a small but realistic MVP backend. Some features are intentionally missing (no refresh tokens, no full LMS) while I stabilise the core flows.

- **Authentication & Accounts**

  - User registration with hashed passwords (bcryptjs)
  - Email-style account activation using a dedicated activation JWT and a simple activation redirect page under `public/auth/`
  - Login that returns a JWT access token signed with an app secret
  - Auth middleware that:
    - Verifies the JWT and attaches `loggedInUser` to the request
    - Enforces `isActive` and role-based access (`applicant`, `student`, `teacher`, `admin`)

- **Admission / Applicant Flow (Implemented)**

  - `User` model with roles (`APPLICANT`, `STUDENT`, `TEACHER`, `ADMIN`) and `isActive`
  - `Applicant` model linked to `User` for admission information (programme, dob, address, etc.)
  - `Admission` model that tracks each application with a status enum (`draft`, `under_review`, `accepted`, `rejected`)
  - Applicant endpoints:
    - Apply once for admission (creates `Applicant` + `Admission` with `UNDER_REVIEW`)
    - View own application status
  - Admin endpoints:
    - List all applications with pagination and optional status filter
    - View a single application with joined applicant + user info
    - Update an application status from `UNDER_REVIEW` to `ACCEPTED` or `REJECTED`
    - On `ACCEPTED`, automatically promote the user role from `APPLICANT` to `STUDENT` and create a `Student` record with a generated registration number

- **Student Domain (Initial)**

  - `Student` model linked to `User` and `Admission` (registration number, programme, batch, semester)
  - Router split between:
    - Student self routes (`/me`) guarded by `STUDENT` role
    - Admin-only routes for listing and inspecting students
  - Controllers for student routes are currently thin and will be evolved once the loading logic and DTOs are finalised

- **Validation & Error Handling**

  - Request body validation using Joi per-route schemas
  - Central error-handling middleware with consistent JSON error contracts

- **Simple Frontend for Testing**
  - Minimal static HTML pages served from `public/` to manually test register/login/activation while the real frontend does not exist yet

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

- Harden the admission flow (better status transition rules, optional email notifications on decision, basic auditing)
- Flesh out the student profile API (DTOs for `/me`, admin list/detail, controlled updates to academic fields)
- Add small, focused “student portal” features (notices, simple dashboard data) on top of the existing models
- Only after the backend stabilises: start minimal LMS-style entities (courses, enrolments, assignments)
- Keep updating this README as the architecture evolves

This project is mainly for learning and experimentation, so the design may change as I understand more about real college workflows and backend best practices.
