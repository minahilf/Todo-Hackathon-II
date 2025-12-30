# Use an official Python runtime as a parent image
FROM python:3.13-slim

# Prevent Python from writing .pyc files to disc
ENV PYTHONDONTWRITEBYTECODE=1
# Ensure Python output is sent straight to the terminal
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# --- INSTALLATION SECTION (Run as Root) ---

# Copy requirements file
COPY requirements.txt .

# Install dependencies globally (as root) so permissions are correct
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# --- SECURITY SECTION ---

# Create a non-root user
RUN adduser --system --group appuser

# Copy application code
COPY . .

# Give ownership of the app directory to the new user
RUN chown -R appuser:appuser /app

# Switch to non-root user for security (Runtime only)
USER appuser

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]