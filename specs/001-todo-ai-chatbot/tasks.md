# Tasks for Feature: Todo AI Chatbot (Stateless + MCP)

**Branch**: `001-todo-ai-chatbot`
**Date**: 2025-12-26
**Spec**: [specs/001-todo-ai-chatbot/spec.md](specs/001-todo-ai-chatbot/spec.md)
**Plan**: [specs/001-todo-ai-chatbot/plan.md](specs/001-todo-ai-chatbot/plan.md)

## Implementation Strategy

The implementation will follow an iterative approach, focusing on delivering core functionality first. User Story 1 (Create and Manage Tasks via Chat) is the primary MVP. Subsequent user stories will build upon this foundation. Parallelization will be sought where tasks are independent, primarily within frontend and backend development streams.

## Dependencies

*   **User Story 1 (P1) Create and Manage Tasks via Chat**: Depends on Database Schema, MCP Server & Tools Logic, AI Agent & Stateless Chat Endpoint (core functionality).
*   **User Story 2 (P2) Persistent Conversations**: Depends on Database Schema (Conversation, Message models), AI Agent & Stateless Chat Endpoint (message persistence).
*   **User Story 3 (P2) Stateless Backend Interaction**: Cross-cutting concern, addressed during AI Agent & Stateless Chat Endpoint development.

## Phase 1: Environment Setup (Dependencies & Config)

- [ ] T001 Initialize a Python virtual environment in `backend/venv`
- [ ] T002 Install backend dependencies: FastAPI, SQLModel, python-dotenv, uvicorn, bcrypt, python-jose[cryptography], psycopg2-binary, openai, langchain in `backend/requirements.txt`
- [ ] T003 Configure backend `.env` with `DATABASE_URL`, `SECRET_KEY`, `OPENAI_API_KEY` in `backend/.env`
- [ ] T004 Ensure Node.js and npm/yarn are installed (system-level check)
- [ ] T005 Navigate to `frontend` directory and install existing dependencies from `frontend/package.json`
- [ ] T006 Configure frontend `.env.local` with `NEXT_PUBLIC_API_URL` pointing to backend in `frontend/.env.local`
- [ ] T007 Set up a Neon Postgres database instance and obtain connection string (external task, document in quickstart)
- [ ] T007.5 Create `backend/create_user.py` script to seed 'admin' user

## Phase 2: Database Schema (Models & Migrations)

- [ ] T008 [P] Define SQLModel `Task` in `backend/src/models/task.py`
- [ ] T009 [P] Define SQLModel `Conversation` in `backend/src/models/conversation.py`
- [ ] T010 [P] Define SQLModel `Message` in `backend/src/models/message.py`
- [X] T011 Implement `create_db_and_tables()` function for SQLModel in `backend/main.py`
- [X] T012 Update `backend/main.py` to call `create_db_and_tables()` on startup

## Phase 3: MCP Server & Tools Logic

- [X] T013 [P] Implement `add_task` MCP tool in `backend/src/services/mcp_tools.py`
- [X] T014 [P] Implement `list_tasks` MCP tool in `backend/src/services/mcp_tools.py`
- [X] T015 [P] Implement `complete_task` MCP tool in `backend/src/services/mcp_tools.py`
- [X] T016 [P] Implement `delete_task` MCP tool in `backend/src/services/mcp_tools.py`
- [X] T017 [P] Implement `update_task` MCP tool in `backend/src/services/mcp_tools.py`
- [X] T018 Register MCP tools with OpenAI Agents SDK using Official MCP SDK in `backend/src/services/ai_agent.py`

## Phase 4: AI Agent & Stateless Chat Endpoint

- [X] T019 [US1, US2, US3] Create FastAPI endpoint `POST /api/chat` in `backend/src/api/chat.py`
- [X] T020 [US2] Implement logic to retrieve/create `Conversation` for user in `backend/src/api/chat.py`
- [X] T021 [US2] Persist incoming user messages into `Message` table in `backend/src/api/chat.py`
- [X] T022 [US1, US2, US3] Integrate OpenAI Agents SDK to process messages in `backend/src/api/chat.py`
- [X] T023 [US1, US2] Generate natural language response based on tool output/AI interaction in `backend/src/api/chat.py`
- [X] T024 [US2] Persist AI agent's response message into `Message` table in `backend/src/api/chat.py`
- [X] T025 [US3] Ensure statelessness of `/api/chat` endpoint and handle user authentication (JWT) in `backend/src/api/chat.py`
- [X] T026 Integrate `chat.py` endpoint into main FastAPI app in `backend/main.py`

## Phase 5: Frontend Integration (ChatKit)

- [X] T027 [P] [US1, US2] Install OpenAI ChatKit and necessary React/Next.js dependencies in `frontend/package.json`
- [X] T028 [US1, US2] Integrate OpenAI ChatKit into Next.js to create a conversational UI in `frontend/src/pages/chat.tsx`
- [ ] T029 [US2] Display past messages from `Message` history in `frontend/src/pages/chat.tsx`
- [X] T030 [US1] Provide an input field for users to send new messages in `frontend/src/pages/chat.tsx`
- [X] T031 [US1, US2] Develop service layer to send messages to `POST /api/chat` in `frontend/src/services/chat_api.ts`
- [X] T032 [US1, US2] Handle streaming/polling for chatbot responses in `frontend/src/services/chat_api.ts`
- [X] T033 [US1, US2] Implement error handling and loading states for chat interactions in `frontend/src/pages/chat.tsx`
- [X] T034 [US1, US2, US3] Ensure authentication context is used with chat requests in `frontend/src/services/chat_api.ts`

## Final Phase: Polish & Cross-Cutting Concerns

- [ ] T035 [P] Add Jest and React Testing Library for frontend testing `frontend/package.json`
- [ ] T036 [P] Implement comprehensive backend tests for MCP tools and AI agent logic in `backend/tests/`
- [ ] T037 [P] Implement comprehensive frontend tests for chat UI components in `frontend/tests/`
- [ ] T038 Review and refine error handling across both frontend and backend.
- [ ] T039 Update `quickstart.md` with final installation and running instructions.
- [ ] T040 Performance testing and optimization for chat endpoint response times.

## Parallel Execution Examples

### Parallel Stream 1: Backend Development

- [ ] T008 [P] Define SQLModel `Task` in `backend/src/models/task.py`
- [ ] T009 [P] Define SQLModel `Conversation` in `backend/src/models/conversation.py`
- [ ] T010 [P] Define SQLModel `Message` in `backend/src/models/message.py`
- [ ] T013 [P] Implement `add_task` MCP tool in `backend/src/services/mcp_tools.py`
- [ ] T014 [P] Implement `list_tasks` MCP tool in `backend/src/services/mcp_tools.py`
- [ ] T015 [P] Implement `complete_task` MCP tool in `backend/src/services/mcp_tools.py`
- [ ] T016 [P] Implement `delete_task` MCP tool in `backend/src/services/mcp_tools.py`
- [ ] T017 [P] Implement `update_task` MCP tool in `backend/src/services/mcp_tools.py`
- [ ] T036 [P] Implement comprehensive backend tests for MCP tools and AI agent logic in `backend/tests/`

### Parallel Stream 2: Frontend Development

- [ ] T027 [P] [US1, US2] Install OpenAI ChatKit and necessary React/Next.js dependencies in `frontend/package.json`
- [ ] T035 [P] Add Jest and React Testing Library for frontend testing `frontend/package.json`
- [ ] T037 [P] Implement comprehensive frontend tests for chat UI components in `frontend/tests/`

## Independent Test Criteria for User Stories

### User Story 1 - Create and Manage Tasks via Chat (P1)
- **Independent Test**: Sending natural language commands to the `/api/chat` endpoint and verifying task states in the database.
- **Acceptance Scenarios**: As defined in `specs/001-todo-ai-chatbot/spec.md`.

### User Story 2 - Persistent Conversations (P2)
- **Independent Test**: Starting a conversation, closing the chat, and reopening it to verify that previous messages are loaded.
- **Acceptance Scenarios**: As defined in `specs/001-todo-ai-chatbot/spec.md`.

### User Story 3 - Stateless Backend Interaction (P2)
- **Independent Test**: Sending multiple independent requests to the `/api/chat` endpoint and observing that each request is processed without reliance on previous requests (except for database state).
- **Acceptance Scenarios**: As defined in `specs/001-todo-ai-chatbot/spec.md`.

## Suggested MVP Scope

The MVP will focus on delivering User Story 1: "Create and Manage Tasks via Chat". This includes:
*   Environment Setup (Phase 1)
*   Database Schema (Task model) (Phase 2, T008, T011, T012)
*   MCP Tools for basic CRUD (add_task, list_tasks, complete_task) (Phase 3, T013, T014, T015)
*   AI Agent & Stateless Chat Endpoint (without full conversation history for MVP) (Phase 4, T019, T022, T023, T025, T026)
*   Basic Frontend Chat Interface to send messages and display responses (Phase 5, T027, T028, T030, T031, T033, T034)
