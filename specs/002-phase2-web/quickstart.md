# Quickstart Guide: Phase 2 Web App

This guide provides instructions to set up and run the backend and frontend services for the To-Do application.

## Prerequisites

- Python 3.9+ and `pip`
- Node.js 18+ and `npm`
- Access to a PostgreSQL database

## 1. Backend Setup (FastAPI)

### Installation

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    # For Windows
    python -m venv venv
    .\venv\Scripts\activate

    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install fastapi "uvicorn[standard]" sqlmodel psycopg2-binary python-dotenv
    ```

4.  **Create a `.env` file** in the `backend/` directory and add your database connection string:
    ```env
    DATABASE_URL="postgresql://user:password@host:port/database"
    ```

### Running the Backend

From the `backend/` directory, run the following command:

```bash
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`. You can view the interactive documentation at `http://127.0.0.1:8000/docs`.

## 2. Frontend Setup (Next.js)

### Installation

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **(If not already done) Set up Tailwind CSS:**
    The project should already be configured. If starting from scratch, you would run:
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```
    Then configure `tailwind.config.js` and `styles/globals.css`.

### Running the Frontend

From the `frontend/` directory, run the following command:

```bash
npm run dev
```

The web application will be available at `http://localhost:3000`.

## 3. Integration

The frontend is configured to send API requests to the backend service running on `http://127.0.0.1:8000`. Ensure the backend is running before you start the frontend to allow for successful data fetching.
