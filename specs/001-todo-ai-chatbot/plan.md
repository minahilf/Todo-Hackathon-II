# Implementation Plan: Todo AI Chatbot (Stateless + MCP)

**Branch**: `001-todo-ai-chatbot` | **Date**: 2025-12-26 | **Spec**: [specs/001-todo-ai-chatbot/spec.md](specs/001-todo-ai-chatbot/spec.md)
**Input**: Feature specification from `specs/001-todo-ai-chatbot/spec.md`

## Summary

Build a conversational Todo Chatbot using the Model Context Protocol (MCP) with a stateless FastAPI backend, OpenAI Agents SDK for AI, SQLModel with Neon Postgres for data persistence, and OpenAI ChatKit for the frontend.

## Technical Context

**Language/Version**: Python 3.11+ (Backend), TypeScript (Frontend)
**Primary Dependencies**: FastAPI, OpenAI Agents SDK, Official MCP SDK, SQLModel, Neon Postgres, OpenAI ChatKit, Next.js
**Storage**: Neon Postgres (SQLModel ORM)
**Testing**: pytest (Backend), Jest/React Testing Library (Frontend)
**Target Platform**: Web (Frontend), Linux Server (Backend)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: Chatbot responses within 2 seconds for 90% of requests.
**Constraints**: Stateless `POST /api/chat` endpoint. All state persisted in DB.
**Scale/Scope**: Conversational Todo Chatbot for individual users, managing tasks.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[No specific constitution provided, assuming general good practices. Will re-evaluate if a project constitution is defined later.]

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-ai-chatbot/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/            # SQLModel definitions for Task, Conversation, Message
│   ├── services/          # MCP tools implementation, AI agent logic
│   └── api/               # FastAPI chat endpoint
└── tests/

frontend/
├── src/
│   ├── components/        # ChatKit UI components, custom components
│   ├── pages/             # Chat interface page
│   └── services/          # API integration for /api/chat
└── tests/
```

**Structure Decision**: Selected `Option 2: Web application` structure, adapted for current project layout.

## Implementation Checklist for Phase III: Todo AI Chatbot

### 1. Environment Setup (Dependencies & Config)

*   **1.1 Backend**:
    *   Initialize a new Python virtual environment for the backend.
    *   Install FastAPI, SQLModel, `python-dotenv`, `uvicorn`, `bcrypt`, `jose` for JWT, `psycopg2-binary` (or equivalent for Neon Postgres).
    *   Install OpenAI Agents SDK and Official MCP SDK.
    *   Configure `.env` for `DATABASE_URL`, `OPENAI_API_KEY`, `SECRET_KEY` (for JWT).
*   **1.2 Frontend**:
    *   Ensure Node.js and npm/yarn are installed.
    *   Install OpenAI ChatKit and necessary React/Next.js dependencies.
    *   Configure `.env` for `NEXT_PUBLIC_API_URL` pointing to the backend.
*   **1.3 Database**:
    *   Set up a Neon Postgres database instance.
    *   Obtain connection string for `DATABASE_URL`.

### 2. Database Schema (Models & Migrations)

*   **2.1 Define SQLModel `Task`**:
    *   Map `Task` entity from spec: `id`, `title`, `description`, `completed`, `user_id`.
    *   Establish foreign key relationship to `User` model (already existing).
*   **2.2 Define SQLModel `Conversation`**:
    *   Create model for conversation tracking: `id`, `user_id`.
    *   Establish foreign key relationship to `User` model.
*   **2.3 Define SQLModel `Message`**:
    *   Create model for chat messages: `id`, `conversation_id`, `sender` (enum or string), `content`, `timestamp`.
    *   Establish foreign key relationship to `Conversation` model.
*   **2.4 Database Initialization**:
    *   Implement `create_db_and_tables()` function to create all defined SQLModel tables on startup if they don't exist.

### 3. MCP Server & Tools Logic

*   **3.1 Implement MCP Tools**:
    *   `add_task(user_id: int, title: str, description: Optional[str])`: Creates a new task.
    *   `list_tasks(user_id: int)`: Retrieves all tasks for a user.
    *   `complete_task(user_id: int, task_id: int)`: Marks a task as completed.
    *   `delete_task(user_id: int, task_id: int)`: Deletes a task.
    *   `update_task(user_id: int, task_id: int, title: Optional[str], description: Optional[str], completed: Optional[bool])`: Updates task details.
    *   Each tool should interact with the SQLModel database.
*   **3.2 MCP Tool Integration**:
    *   Register these tools with the OpenAI Agents SDK using the Official MCP SDK.

### 4. AI Agent & Stateless Chat Endpoint

*   **4.1 FastAPI Chat Endpoint (`POST /api/chat`)**:
    *   Create a new FastAPI endpoint `POST /api/chat`.
    *   This endpoint will accept user messages.
    *   Implement logic to retrieve or create a `Conversation` for the user.
    *   Persist incoming user messages into the `Message` table.
*   **4.2 AI Agent Orchestration**:
    *   Integrate OpenAI Agents SDK to process incoming messages.
    *   The AI agent will analyze user input and determine which MCP tool to call.
    *   Pass necessary parameters to the MCP tools.
    *   Receive results from MCP tools.
*   **4.3 Generate & Persist Responses**:
    *   Generate a natural language response to the user based on tool output or direct AI interaction.
    *   Persist the AI agent's response message into the `Message` table.
*   **4.4 Statelessness Enforcement**:
    *   Ensure the `/api/chat` endpoint does not store any user session-specific data in memory between requests; rely entirely on the database for state.
    *   User authentication must be handled for each request (e.g., via JWT).

### 5. Frontend Integration (ChatKit)

*   **5.1 Chat Interface**:
    *   Integrate OpenAI ChatKit into the Next.js frontend to create a conversational UI.
    *   Display past messages from the `Message` history.
    *   Provide an input field for users to send new messages.
*   **5.2 API Communication**:
    *   Develop a service layer in the frontend to send user messages to the `POST /api/chat` endpoint.
    *   Handle streaming or polling for chatbot responses.
    *   Implement error handling and loading states for chat interactions.
*   **5.3 Authentication Context**:
    *   Ensure the frontend's authentication context is used to pass user tokens with chat requests.
*   **5.4 Real-time Updates (Optional, but Recommended)**:
    *   Consider implementing WebSockets or long-polling if real-time message updates are desired for the chat interface, beyond simple request/response.