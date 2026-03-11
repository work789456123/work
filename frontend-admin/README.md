# PashuVaani 🐄

PashuVaani is an AI-powered veterinary network and farm management dashboard designed to help field officers, veterinarians, and farmers monitor livestock health, manage consultations, and track AI-driven health alerts.

![PashuVaani Dashboard](https://lh3.googleusercontent.com/aida-public/AB6AXuD1BT_oEVLPRqGTKA9ET3NlarRlE8-Ujg28eRzPW4BWWVFXxT7D0abXbudrYqQ9c6Uemuu4seoa27hp-yFTkVsUFb5Szt0LyFujQoyMkSBVLwmGC1-tsx0_nEb1UTStKxJ6sH3JXdV5hddpV-LvefvR4lEkNCfi-9ZfbVKwQ8u8yGSNbLxBFCYQBbVTmbOJjkbDMkMXVDaACZV7gYti6jO7B3AoThrmrbnGnWql03iU4-zAcc6CGU6zT-pnyuoCrMHrr6d8ZlumaKs)

## Features 🚀

-   **👨‍🌾 Farmer Directory**: Manage farmer profiles, total livestock, and contact information.
-   **🐄 Animal Health Tracking**: Monitor individual animal health records, tags, and AI-predicted diagnoses.
-   **🩺 Veterinary Consultations**: Track ongoing and completed vet service tickets.
-   **🤖 AI Monitoring Feed**: Real-time alerts based on camera feeds and biometric sensors (e.g., thermal anomalies).
-   **🔐 Role-Based Access Control (RBAC)**: Secure JWT-based authentication with distinct roles for Admins, Vets, and Users.

## Tech Stack 🛠️

-   **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Axios, React Router v6.
-   **Backend**: Python 3.11+, FastAPI, SQLAlchemy, Pydantic, Passlib, Python-JOSE (JWT).
-   **Database**: PostgreSQL 15 (running via Docker).

---

## Local Setup Guide 💻

Follow these instructions to get the PashuVaani full-stack application running on your local machine.

### Prerequisites

Ensure you have the following installed on your system:
-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [Python](https://www.python.org/downloads/) (v3.10 or higher)
-   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Required for the local PostgreSQL database)

### 1. Backend Setup & Database 🗄️

Open a terminal and navigate to the project root, then into the `backend` folder.

```bash
cd PashuVani/backend

# 1. Start the PostgreSQL database using Docker
docker-compose up -d

# 2. Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# 3. Install the Python dependencies
pip install -r requirements.txt

# 4. Seed the database with initial tables and dummy data
python seed.py

# 5. Start the FastAPI backend server
uvicorn app.main:app --reload
```

The backend API will now be running at `http://localhost:8000`. You can view the interactive Swagger API documentation at `http://localhost:8000/docs`.

#### Default Credentials (Seeded)
The `seed.py` script automatically creates the following users for testing the RBAC flow:
-   **Admin**: `admin` / `admin123`
-   **Vet**: `vet_dr_anjali` / `vet123`
-   **Farmer**: `farmer_aman` / `farmer123`

### 2. Frontend Setup 🌐

Open a **new** terminal window and navigate to the project root.

```bash
cd PashuVani

# 1. Install Node.js dependencies
npm install

# 2. Start the Vite development server
npm run dev
```

The frontend application will now be running, typically at `http://localhost:5173` or `http://localhost:5174`.

### 3. Usage 🔑
1.  Open the frontend URL in your browser.
2.  You will be presented with the `PashuVaani` login screen.
3.  Log in using the default Admin credentials (`admin` / `admin123`).
4.  Explore the dashboard! The frontend uses an Axios API Interceptor to automatically attach your JWT to all outgoing requests to fetch the live PostgreSQL data.

---

### Project Structure 📁

```text
PashuVani/
├── backend/                  # FastAPI Backend
│   ├── app/                  # Application code
│   │   ├── main.py           # API endpoints
│   │   ├── models.py         # SQLAlchemy DB models
│   │   ├── schemas.py        # Pydantic validation schemas
│   │   ├── auth.py           # JWT and Passlib logic
│   │   └── database.py       # DB connection
│   ├── docker-compose.yml    # PostgreSQL container config
│   ├── requirements.txt      # Python dependencies
│   └── seed.py               # Database seeder script
├── src/                      # React Frontend
│   ├── components/           # Reusable UI components
│   ├── config/               # Environment & feature flags (API_BASE_URL)
│   ├── pages/                # Page-level components
│   └── services/             # API clients (Axios interceptors)
```
