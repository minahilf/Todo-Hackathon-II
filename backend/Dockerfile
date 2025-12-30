# syntax=docker/dockerfile:1
FROM python:3.13-slim AS base

# Prevent Python from writing .pyc files to disc
ENV PYTHONDONTWRITEBYTECODE=1

# Ensure Python output is sent straight to the terminal
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Create a non-root user
RUN adduser --system --group appuser && chown -R appuser:appuser /app
USER appuser

FROM base AS builder

WORKDIR /app

# Install pip dependencies
COPY --chown=appuser:appuser backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

FROM base AS final

WORKDIR /app

# Copy application code
COPY --from=builder --chown=appuser:appuser /app /app
COPY --chown=appuser:appuser backend/main.py backend/src/ ./ 

# Expose the port FastAPI listens on
EXPOSE 8000

# Run the application using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]