FROM --platform=linux/amd64 python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
# We force bcrypt 3.1.7 to avoid the passlib compatibility issue
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir "bcrypt==3.1.7"

# Application + Alembic (do not list alembic/ in .dockerignore). Migrations run at API startup — see app/main.py.
COPY alembic.ini .
COPY alembic ./alembic
COPY app ./app

# Remaining files (scripts, tests, etc.) — keep after targeted copies so alembic stays explicit.
COPY . .

# Expose port 80
EXPOSE 80

# Migrations run inside FastAPI lifespan (see app/main.py) so one process owns startup.
# After `docker push`, force a new ECS deployment so tasks pull the new digest.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80", "--proxy-headers", "--forwarded-allow-ips=*"]
