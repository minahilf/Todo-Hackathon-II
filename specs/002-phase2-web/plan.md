# Implementation Plan: Phase 2 Web App

**Branch**: `002-phase2-web` | **Date**: 2025-12-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-phase2-web/spec.md`

## Summary

This plan details the implementation of a web-based interface and a persistent database backend for the To-Do application. It replaces the in-memory console application from Phase 1 with a full-stack solution composed of a FastAPI backend and a Next.js frontend, using a PostgreSQL database for storage.

## Technical Context

**Language/Version**: Python 3.11, Node.js 18+
**Primary Dependencies**: FastAPI, SQLModel, Next.js, Tailwind CSS
**Storage**: PostgreSQL (hosted on Neon)
**Testing**: Pytest (for backend), Jest/React Testing Library (for frontend)
**Target Platform**: Web Browsers
**Project Type**: Web Application (frontend + backend)
**Performance Goals**: API p99 response time < 500ms, UI loads < 2s
**Constraints**: Phase 1 console app in `src/` must remain untouched.
**Scale/Scope**: Single-user to-do list, can be extended for multi-user in the future.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- The project constitution at `.specify/memory/constitution.md` is currently a template. There are no specific, concrete principles to validate against at this time. The current plan adheres to general software engineering best practices.

## Project Structure

### Documentation (this feature)

```text
specs/002-phase2-web/
├── plan.md              # This file
├── research.md          # Research on DB connections and project structure
├── data-model.md        # Formal definition of the Task entity
├── quickstart.md        # Setup and run instructions
├── contracts/           # API contract
│   └── openapi.yaml
└── tasks.md             # (To be created by /sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── .env                 # Local environment variables (DB connection string)
├── main.py              # FastAPI application, endpoints, and DB logic
└── requirements.txt     # Python dependencies

frontend/
├── app/                 # Next.js pages and components
├── public/
└── package.json         # Node.js dependencies
```

**Structure Decision**: A two-directory (`backend/`, `frontend/`) structure is chosen to clearly separate the concerns of the API and the user interface, aligning with modern web application architecture.

## Implementation Stages

This plan will be executed in three main stages as requested.

### Stage 1: Backend Setup (FastAPI)

1.  **Initialize Environment**: Create a `backend` directory. Inside it, set up a Python virtual environment and a `requirements.txt` file.
2.  **Install Dependencies**: Install `fastapi`, `uvicorn`, `sqlmodel`, `psycopg2-binary`, and `python-dotenv`.
3.  **Database Model**: In `backend/main.py`, define the `Task` table using SQLModel based on `data-model.md`.
4.  **Database Connection**: Implement logic to connect to the PostgreSQL database using the connection string from the `.env` file. Include logic to create the database and tables if they don't exist.
5.  **API Endpoints**: Create all CRUD API endpoints for tasks (`GET /tasks`, `POST /tasks`, `GET /tasks/{id}`, `PUT /tasks/{id}`, `DELETE /tasks/{id}`) in `backend/main.py`.
6.  **CORS**: Enable CORS (Cross-Origin Resource Sharing) middleware in FastAPI to allow requests from the frontend domain.

### Stage 2: Frontend Setup (Next.js)

1.  **Initialize Project**: Create a `frontend` directory and initialize a new Next.js application within it.
2.  **Styling**: Install and configure Tailwind CSS for modern, utility-first styling.
3.  **Component Structure**: Create basic React components for:
    -   `TaskList`: To display the list of tasks.
    -   `TaskItem`: To display a single task with delete and update controls.
    -   `AddTaskForm`: A form to input and create new tasks.
4.  **Page Setup**: Use the main page (`app/page.tsx`) to assemble the components into a cohesive UI.

### Stage 3: Integration

1.  **API Service Layer**: In the frontend, create a utility file (e.g., `services/api.ts`) to handle all `fetch` requests to the backend API. This centralizes API logic.
2.  **Data Fetching**: In the `TaskList` component, use `useEffect` to fetch all tasks from the backend when the component mounts.
3.  **State Management**: Use `useState` to manage the list of tasks, loading states, and error states.
4.  **Mutations**: Implement the functions to handle creating, deleting, and updating tasks. These functions will call the corresponding methods in the API service layer and then update the local state to reflect the changes.
5.  **User Feedback**: Implement loading indicators while data is being fetched or mutated, and display error messages if API calls fail.

## Complexity Tracking

No constitution violations were identified that require justification.