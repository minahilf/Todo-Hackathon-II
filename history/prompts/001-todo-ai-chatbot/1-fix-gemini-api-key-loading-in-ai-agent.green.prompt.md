---
id: 1
title: Fix Gemini API Key Loading in AI Agent
stage: green
date: 2025-12-28
surface: agent
model: gemini-pro
feature: 001-todo-ai-chatbot
branch: 001-todo-ai-chatbot
user: minahilf
command: /sp.implement
labels: ["api-key", "bugfix", "python", "dotenv"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - backend/src/services/ai_agent.py
tests:
 - none
---

## Prompt

/sp.implement The user is encountering an issue where `backend/src/services/ai_agent.py` fails to load the `GEMINI_API_KEY` because it cannot locate the `.env` file located in the root `backend/` directory.

Please REWRITE `backend/src/services/ai_agent.py` to explicitly load the environment variables using a relative path.

**Requirements for the file:**
1.  **Imports**: Use `google.generativeai`, `os`, `dotenv`, and `pathlib`.
2.  **Path Logic**:
    * Calculate the path to the `.env` file dynamically: `Path(__file__).resolve().parent.parent.parent / ".env"`.
    * Force load the dot file using `load_dotenv(dotenv_path=env_path)`.
3.  **Debug Prints**: Add print statements to show the calculated path and whether the API key was found (print only the first 4 characters for security).
4.  **Gemini Setup**: Configure `genai` with the loaded key.
5.  **Function**: Keep the `get_chat_response(message: str)` function that uses `gemini-1.5-flash` and returns the text response with error handling.

Execute this update to fix the path resolution issue.

## Response snapshot

Successfully rewrote `backend/src/services/ai_agent.py` to correctly load the GEMINI_API_KEY from the `.env` file using a relative path, and added debug prints for verification.

## Outcome

- ✅ Impact: Fixed a critical bug preventing the AI service from authenticating with the Gemini API due to an incorrect path to the .env file. The application should now be able to load the API key correctly.
- 🧪 Tests: none
- 📁 Files: backend/src/services/ai_agent.py
- 🔁 Next prompts: none
- 🧠 Reflection: Using `pathlib` for dynamic path resolution is a robust solution for making python applications more portable, especially when dealing with environment files in nested directory structures.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): n/a
