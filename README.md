# PashuVaani Local Setup Guide

Welcome to the PashuVaani repository! This guide provides comprehensive instructions on how to set up and run the different components of the project locally.

## Project Structure
The repository consists of multiple components:
- `frontend/`: The main Next.js (App Router) web application for end users.
- `pvadmin/`: The React web application for administrators.
- `backend/`: The FastAPI backend architecture utilizing PostgreSQL, Alembic migrations, and Docker.

---

## 🏗️ 1. Frontend Setup (User Portal)

The main frontend is a **Next.js 15** application (App Router, Tailwind CSS). Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_BACKEND_URL` to your API origin (same host you used for `VITE_BACKEND_URL` in the old Vite app).

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
The application will be accessible at `http://localhost:3000`.

**Production Docker:** build with `docker build --build-arg NEXT_PUBLIC_BACKEND_URL=https://your-api.example.com -t pashuvaani-web .` and run exposing port **3000** (Node standalone server, not nginx).

---

## 🏗️ 2. Admin Frontend Setup

The admin frontend is a separate React application designed for the PashuVaani staff.

1. **Navigate to the frontend-admin directory:**
   ```bash
   cd frontend-admin
   ```
2. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```
3. **Run the development server:**
   ```bash
   yarn start
   # or
   npm start
   ```

---

## ⚙️ 3. Backend Setup

The backend uses FastAPI, PostgreSQL, and Alembic for migrations. The easiest way to run it is via Docker.

1. **Navigate to the directory:**
   ```bash
   cd backend
   ```
2. **Set up Environment Variables:**
   Create a `.env` file in the `backend/` directory with your database connection secrets and API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   SECRET_KEY=your_secret_key
   DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/pashuvaani
   ADMIN_EMAIL=admin@pashuvaani.com
   ADMIN_PASSWORD=admin123
   ```
3. **Run using Docker Compose:**
   ```bash
   docker-compose up --build
   ```
The backend API will be available on the configured port.

*To run locally without Docker:*
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```
