# Basic Full-Stack Project: React + Node.js + Express + PostgreSQL

A beginner-friendly **Task Manager** with a React frontend, Express REST API, and PostgreSQL database.

## Requirements
- Node.js 18+
- PostgreSQL 14+
- npm

## 1. Create the PostgreSQL database
Open `psql` or pgAdmin's Query Tool and run:

```sql
CREATE DATABASE basic_fullstack;
```

Then connect to `basic_fullstack` and run the SQL in `backend/schema.sql`.

## 2. Configure the backend
Open a terminal in `backend/`:

```bash
npm install
```

Copy `.env.example` to `.env` and update the PostgreSQL credentials:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/basic_fullstack
```

If your PostgreSQL user/password differs, replace those values. Start the API:

```bash
npm run dev
```

API runs at `http://localhost:5000`. Test `http://localhost:5000/api/health`.

## 3. Configure the frontend
Open a second terminal in `frontend/`:

```bash
npm install
npm run dev
```

Open the Vite URL printed in the terminal, usually `http://localhost:5173`.

## Features
- List tasks
- Add a task
- Mark a task completed / not completed
- Delete a task
- PostgreSQL persistence
- Basic loading and error messages

## API endpoints
- `GET /api/health` — API/database status
- `GET /api/tasks` — list tasks
- `POST /api/tasks` — create task (`{ "title": "Learn React" }`)
- `PATCH /api/tasks/:id` — update completion (`{ "completed": true }`)
- `DELETE /api/tasks/:id` — delete task

## Troubleshooting
- **Database connection error:** check PostgreSQL is running, database exists, and `DATABASE_URL` credentials are correct.
- **Missing table:** run `backend/schema.sql` while connected to `basic_fullstack`.
- **CORS/network error:** make sure backend runs on port 5000 and frontend on the Vite port.
- **PowerShell copy env file:** `Copy-Item .env.example .env`
- **Linux/macOS copy env file:** `cp .env.example .env`

This is a learning starter, not production-hardened. Add authentication, validation, and deployment configuration before production use.
