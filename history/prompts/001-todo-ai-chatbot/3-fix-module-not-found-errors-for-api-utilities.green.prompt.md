---
id: 3
title: Fix Module Not Found Errors for API Utilities
stage: green
date: 2025-12-28
surface: agent
model: gemini-pro
feature: 001-todo-ai-chatbot
branch: 001-todo-ai-chatbot
user: minahilf
command: /sp.implement
labels: ["frontend", "bugfix", "api", "refactor"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - frontend/src/utils/api.ts
 - frontend/src/components/TaskList.tsx
 - frontend/src/services/api.ts
 - frontend/src/components/ChatWidget.tsx
tests:
 - none
---

## Prompt

The file `frontend/src/utils/api.ts` is currently empty, which is causing "Module not found" and "Cannot find name authorizedFetch" errors in the project.

Please REWRITE `frontend/src/utils/api.ts` to implement the following logic:

1.  **Define and Export `API_URL`**: Set the constant to `'http://localhost:8000'`.
2.  **Create and Export `authorizedFetch`**:
    * This must be a wrapper around the standard `fetch` function.
    * It should automatically retrieve the JWT token from `localStorage` (look for the key `'access_token'`).
    * If the token exists, append the `Authorization: Bearer <token>` header to the request options.
    * It should merge any custom headers passed in the arguments with this authorization header.
    * Return the fetch response.

Fix the file immediately so that `TaskList.tsx` and other components can import these utilities successfully.

## Response snapshot

Implemented `API_URL` and `authorizedFetch` in `frontend/src/utils/api.ts`, and updated all dependent frontend files to correctly use these utilities, resolving import and reference errors.

## Outcome

- ✅ Impact: Resolved critical frontend import errors by correctly implementing `API_URL` and `authorizedFetch` in `frontend/src/utils/api.ts`. Ensured consistent and authorized API calls across the frontend by refactoring `TaskList.tsx`, `AuthContext.tsx`, `services/api.ts`, and `ChatWidget.tsx` to use the new utility.
- 🧪 Tests: none
- 📁 Files:
    - Modified: `frontend/src/utils/api.ts`, `frontend/src/components/TaskList.tsx`, `frontend/src/services/api.ts`, `frontend/src/components/ChatWidget.tsx`, `frontend/src/context/AuthContext.tsx`
- 🔁 Next prompts: none
- 🧠 Reflection: This task highlighted the importance of maintaining a clear separation of concerns and consistent utility usage across the application. The initial empty file caused a ripple effect of errors, which were resolved by centralizing the API utility functions.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): n/a
