# Feature Specification: Phase 2: Web UI and Database

**Feature Branch**: `002-phase2-web`
**Created**: 2025-12-26
**Status**: Draft
**Input**: User description: "feature phase2-web. **IMPORTANT:** Create a NEW file at 'specs/features/phase2-web.md'. Do NOT overwrite Phase 1 specs. Context: Building a Web Interface and Database layer, keeping Phase 1 as a reference. User Stories: 1. **Database (P0):** Create a PostgreSQL database using Neon & SQLModel. 2. **Backend API (P0):** Develop REST APIs in `backend/` (FastAPI) to replace the Phase 1 in-memory logic. 3. **Web UI (P1):** Develop a modern UI in `frontend/` (Next.js) to consume these APIs. 4. **Legacy Check:** Ensure Phase 1 code in `src/` remains untouched and runnable."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Database Persistence (Priority: P0)

As a developer, I want to replace the in-memory data store with a persistent PostgreSQL database to ensure data integrity and scalability.

**Why this priority**: This is a critical foundational step to move the to-do application from a temporary, in-memory tool to a persistent, stateful service.

**Independent Test**: The API can be tested to show that created tasks are still present after an application restart, proving data persistence.

**Acceptance Scenarios**:

1.  **Given** the application is running, **When** a new task is created via the API, **Then** the task is saved to the PostgreSQL database.
2.  **Given** the application has been restarted, **When** the API is queried for tasks, **Then** the task created before the restart is successfully retrieved.

---

### User Story 2 - Backend API (Priority: P0)

As a developer, I want to build a RESTful API using FastAPI to provide a clear, modern interface for managing tasks, replacing the direct console interaction from Phase 1.

**Why this priority**: Decouples the business logic from the presentation layer, allowing a separate web UI (and potentially other clients) to interact with the application data.

**Independent Test**: The API can be tested independently using tools like `curl` or a Postman collection to perform all CRUD operations on tasks.

**Acceptance Scenarios**:

1.  **Given** the API is running, **When** a POST request with valid task data is sent to the `/tasks` endpoint, **Then** a new task is created and returned with a `201 Created` status code.
2.  **Given** a task exists in the database, **When** a GET request is sent to the `/tasks/{task_id}` endpoint, **Then** the corresponding task details are returned with a `200 OK` status code.
3.  **Given** a task exists, **When** a PUT request with updated data is sent to `/tasks/{task_id}`, **Then** the task is updated in the database and returned with a `200 OK` status code.
4.  **Given** a task exists, **When** a DELETE request is sent to `/tasks/{task_id}`, **Then** the task is removed from the database and a `204 No Content` status code is returned.

---

### User Story 3 - Web UI (Priority: P1)

As a user, I want a web-based interface to visually manage my to-do items, so I don't have to use a command-line interface.

**Why this priority**: Provides a user-friendly and accessible way for non-technical end-users to interact with the application, which is essential for a consumer-facing product.

**Independent Test**: The web UI can be developed and tested against a mock API to ensure all components render correctly and user interactions trigger the expected API calls.

**Acceptance Scenarios**:

1.  **Given** the web application is loaded in a browser, **When** the main page is viewed, **Then** a list of all current tasks is displayed.
2.  **Given** the user has entered a title for a new task in the input field, **When** they activate the "Add Task" control, **Then** the new task appears in the task list on the UI.
3.  **Given** a task is displayed in the list, **When** the user activates the "Delete" control for that task, **Then** the task is removed from the UI list.
4.  **Given** a task is displayed, **When** the user toggles its completion status, **Then** the UI updates to reflect the new state (e.g., with a strikethrough).

---

### User Story 4 - Preserve Legacy App (Priority: P2)

As a developer, I want to ensure the original Phase 1 console application remains runnable and its code is not modified.

**Why this priority**: To maintain the Phase 1 artifact as a historical reference and ensure that the new development in Phase 2 does not introduce breaking changes or regressions to the existing code.

**Independent Test**: The original `main.py` script can be executed directly from the command line.

**Acceptance Scenarios**:

1.  **Given** the `002-phase2-web` branch is checked out, **When** `python src/main.py` is executed, **Then** the console application starts and operates correctly using its own in-memory data store, without any errors.

---

### Edge Cases

-   **API**: How does the system handle API requests with invalid or incomplete data (e.g., creating a task with no title)? It should return a `422 Unprocessable Entity` response with a descriptive error.
-   **API**: What happens when a user tries to access a task that doesn't exist (e.g., `GET /tasks/999`)? It should return a `404 Not Found` response.
-   **UI**: How are API errors (e.g., server unavailable, validation failure) communicated to the user? The UI should display a non-intrusive notification or error message.
-   **UI**: What is displayed when there are no tasks to show? The UI should display a message like "No tasks yet. Add one to get started!"

## Requirements *(mandatory)*

### Functional Requirements

-   **FR-001**: The system MUST persist all task data in a PostgreSQL database.
-   **FR-002**: The system MUST provide a RESTful API for all CRUD (Create, Read, Update, Delete) operations on tasks.
-   **FR-003**: The API MUST validate incoming data to ensure required fields (e.g., `title`) are present and correctly formatted.
-   **FR-004**: The system MUST provide a web-based user interface for interacting with tasks.
-   **FR-005**: The web UI MUST allow users to view, create, update (e.g., mark as complete), and delete tasks.
-   **FR-006**: The Phase 1 console application code located in the `src/` directory MUST NOT be modified.

### Key Entities

-   **Task**: Represents a single to-do item. Key attributes include a unique identifier (`id`), a `title`, a longer `description`, and a boolean `completed` status.

### Assumptions

-   The technology stack for this phase is explicitly defined as PostgreSQL (managed by Neon), SQLModel (for ORM), FastAPI (for the backend API), and Next.js (for the frontend UI). This specification focuses on the functional "what," while the technical plan will detail the "how" using this stack.

## Success Criteria *(mandatory)*

### Measurable Outcomes

-   **SC-001**: A user can successfully create, view, update, and delete a task through the web interface, with all changes persisting after a full server restart.
-   **SC-002**: All API endpoints for task management must respond in under 500ms and achieve a 99.9% success rate under simulated load.
-   **SC-003**: The original console application in `src/main.py` remains 100% functional, runnable, and passes all its original (implicit) tests without modification.
-   **SC-004**: The web UI's main task list loads in under 2 seconds on a standard internet connection.