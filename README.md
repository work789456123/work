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

---

## 🚀 Deployment to AWS (ECS & RDS)

To deploy PashuVaani to production on AWS using Elastic Container Service (ECS) and Relational Database Service (RDS), follow these guidelines.

### 1. Database (RDS)
Set up a PostgreSQL instance on AWS RDS. When creating the instance:
- Note the **Endpoint** and **Port** (default 5432).
- Ensure the security group allows inbound traffic from your ECS tasks.
- Your production `DATABASE_URL` will look like: `postgresql+asyncpg://USER:PASSWORD@RDS_ENDPOINT:5432/DB_NAME`.

### 2. Environment Variables
Refer to the `.env.production.template` files in both `backend/` and `frontend/` directories for the required variables.

**Backend Key Variables:**
- `DATABASE_URL`: Connection string for RDS.
- `BACKEND_PUBLIC_URL`: The public-facing URL of your API (e.g., `https://api.pashuvaani.com`).
- `FRONTEND_HOST`: The public-facing URL of your frontend (e.g., `https://pashuvaani.com`).
- `CORS_ORIGINS`: Set this to your frontend domain to secure your API.

### 3. Container Images (ECR)
Build and push your Docker images to Amazon Elastic Container Registry (ECR).
Example for Backend:
```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com
docker build -t pashuvaani-be ./backend
docker tag pashuvaani-be:latest YOUR_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/pashuvaani-be:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/pashuvaani-be:latest
```

### 4. ECS Task Definition
When creating your Task Definition:
- Use the ECR image URIs.
- Map the internal container ports (Backend: 80, Frontend: 3000) to your Load Balancer.
- Inject the environment variables listed in the templates. For sensitive values (API keys, DB passwords), it is highly recommended to use **AWS Secrets Manager**.
