# Quickstart Guide: Todo AI Chatbot (Stateless + MCP)

**Date**: 2025-12-26
**Feature**: [specs/001-todo-ai-chatbot/spec.md](specs/001-todo-ai-chatbot/spec.md)
**Plan**: [specs/001-todo-ai-chatbot/plan.md](specs/001-todo-ai-chatbot/plan.md)

This guide provides the essential steps to set up and run the Todo AI Chatbot feature.

## 1. Prerequisites

*   **Python 3.11+**: For the FastAPI backend.
*   **Node.js (LTS)**: For the Next.js frontend.
*   **npm or Yarn**: Node.js package manager.
*   **Git**: For cloning the repository.
*   **Neon Postgres Database**: A running instance of PostgreSQL (Neon recommended for serverless).
*   **OpenAI API Key**: Required for the AI agent.

## 2. Backend Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository_url>
    cd todo # or your project root
    ```
2.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```
3.  **Create and activate a virtual environment**:
    ```bash
    python -m venv venv
    ./venv/Scripts/activate # On Windows
    # source venv/bin/activate # On macOS/Linux
    ```
4.  **Install backend dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
    *(Note: `requirements.txt` will need to be updated with `fastapi`, `uvicorn`, `sqlmodel`, `python-dotenv`, `bcrypt`, `python-jose[cryptography]`, `psycopg2-binary`, `openai`, `langchain` etc. once detailed implementation starts)*
5.  **Configure environment variables**:
    Create a `.env` file in the `backend` directory:
    ```
    DATABASE_URL="postgresql+psycopg2://user:password@host:port/database_name"
    SECRET_KEY="your_super_secret_jwt_key"
    OPENAI_API_KEY="your_openai_api_key"
    ```
    *Replace placeholders with your actual database URL, a strong secret key, and your OpenAI API key.*
6.  **Run database migrations (or initial table creation)**:
    *(This step will be implemented as part of the feature development to create tables based on SQLModel definitions.)*
7.  **Start the FastAPI backend**:
    ```bash
    uvicorn main:app --reload
    ```
    The backend will typically run on `http://localhost:8000`.

## 3. Frontend Setup

1.  **Navigate to the frontend directory**:
    ```bash
    cd ../frontend
    ```
2.  **Install frontend dependencies**:
    ```bash
    npm install # or yarn install
    ```
3.  **Configure environment variables**:
    Create a `.env.local` file in the `frontend` directory:
    ```
    NEXT_PUBLIC_API_URL="http://localhost:8000"
    ```
    *Ensure this points to your running backend instance.*
4.  **Start the Next.js frontend**:
    ```bash
    npm run dev # or yarn dev
    ```
    The frontend will typically run on `http://localhost:3000`.

## 4. Interacting with the Chatbot

*   Once both backend and frontend are running, open your browser to `http://localhost:3000`.
*   Register and log in to the application.
*   Navigate to the chatbot interface (will be developed as part of this feature).
*   Start sending natural language commands like "Add task: Buy groceries", "List my tasks", etc.
