# Employee and Project Management System

A server-rendered web app for managing employees and project modules, built while learning backend development with Node.js.
Admins manage employees and assign project modules; employees see their projects, update module status and manage their profile.

**Stack:** Node.js, Express 5, EJS templates, MongoDB (Mongoose), express-session, bcrypt.

## Features

- Sign up, log in and log out with session-based authentication and bcrypt-hashed passwords.
- Forgot-password and reset flow with a one-time token.
- Admin dashboard: employee list and project module management.
- Employee dashboard: assigned projects, module details and status updates, profile page.

## Run with Docker

```bash
cp .env.example .env   # set SESSION_SECRET, e.g. openssl rand -base64 32
docker compose up -d --build --wait
```

Open http://localhost:3008 and sign up.

## Run locally

Requires Node.js 22 and a MongoDB instance.

```bash
npm ci
echo "DB_URL=mongodb://localhost:27017/employee_management" >> .env
echo "SESSION_SECRET=$(openssl rand -base64 32)" >> .env
npm start
```
