# PashuVaani Local Setup Guide

Welcome to the PashuVaani repository! This guide provides comprehensive instructions on how to set up and run the different components of the project locally.

## Project Structure
The repository consists of multiple components:
- `frontend/`: The main Next.js (App Router) web application for end users.
- `frontend_old/`: Archived Vite + React Router build (reference only; remove after burn-in).
- `frontend-admin/`: The React web application for administrators.
- `backend/`: The legacy FastAPI backend API utilizing MongoDB.
- `backend-new/`: The newer FastAPI backend architecture utilizing PostgreSQL, Alembic migrations, and Docker.

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

You can run either the legacy backend or the new backend depending on your development needs.

### Option A: `backend-new` (Recommended - Docker Setup)
The new backend uses FastAPI, PostgreSQL, and Alembic for migrations. The easiest way to run it is via Docker.

1. **Navigate to the directory:**
   ```bash
   cd backend-new
   ```
2. **Set up Environment Variables:**
   Create a `.env` file in the `backend-new/` directory with your database connection secrets and API keys.
3. **Run using Docker Compose:**
   ```bash
   docker-compose up --build
   ```
The backend API will be available at `http://localhost:80`.

*To run locally without Docker:*
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Option B: `backend` (Legacy - MongoDB)
The legacy backend uses FastAPI and MongoDB. Ensure you have MongoDB installed and running locally.

1. **Navigate to the directory:**
   ```bash
   cd backend
   ```
2. **Set up the virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Set up Environment Variables:**
   Create a `.env` file in `backend/` with the following minimum variables:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=pashuvaani_db
   REACT_APP_API_URL=http://localhost:8000
   SECRET_KEY=your_secret_key
   ADMIN_EMAIL=admin@pashuvaani.com
   ADMIN_PASSWORD=admin123
   CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   ```
5. **Run the development server:**
   ```bash
   uvicorn server:app --reload
   ```
The API will be accessible at `http://localhost:8000` and interactive docs at `http://localhost:8000/docs`.
