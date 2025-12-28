---
id: 2
title: Implement Floating Chat Widget and Agent Fixes
stage: green
date: 2025-12-28
surface: agent
model: gemini-pro
feature: 001-todo-ai-chatbot
branch: 001-todo-ai-chatbot
user: minahilf
command: /sp.implement
labels: ["frontend", "backend", "chat-widget", "tool-calling", "real-time-updates"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - backend/src/services/ai_agent.py
 - backend/src/api/chat.py
 - frontend/src/components/ChatWidget.tsx
 - frontend/src/app/layout.tsx
 - frontend/src/context/AuthContext.tsx
 - frontend/src/components/TaskList.tsx
 - frontend/src/app/chat/page.tsx
tests:
 - none
---

## Prompt

/sp.implement The user wants to improve the Todo Chatbot experience with UI updates and Agent behavior fixes.

Please IMPLEMENT the following 3 critical changes:

1.  **Create a Floating Chat Widget (Frontend):**
    * Instead of a separate `/chat` page, create a `ChatWidget.tsx` component.
    * Add a floating "Chat Icon" to the bottom-right of the Dashboard.
    * When clicked, it opens a small Chat Popup (like Intercom/Support bots).
    * Add this widget to the main `layout.tsx` or Dashboard page so it's always accessible.

2.  **Fix Agent Tool Execution & Conciseness (Backend):**
    * The agent is currently "talking" about adding tasks but not actually calling the tools (hallucinating).
    * **CRITICAL FIX:** Ensure the `get_chat_response` function in `ai_agent.py` correctly handles **Function Calling/Tool Calling**. It must execute the `add_task`, `delete_task` functions effectively when requested.
    * **System Instruction:** Update the system prompt to: "You are a direct Todo Assistant. Use tools immediately. Keep text responses under 15 words. Example: 'Task added.', 'Deleted.', 'Updated.' Do not explain yourself."

3.  **Real-Time Dashboard Updates:**
    * When a task is added/modified via Chat, the Dashboard list MUST update immediately without a manual refresh.
    * Implement a trigger (e.g., `onTaskUpdate` callback or Context refresh) so that when the Chatbot performs an action, the Task List re-fetches data automatically.

**Technical Constraints:**
* Use `lucide-react` for icons.
* Ensure the Chat Widget persists state while open.
* Agent must return concise confirmations only.

Implement these fixes now.

## Response snapshot

Implemented a floating chat widget, fixed the backend agent's tool-calling ability, and enabled real-time updates on the dashboard.

## Outcome

- ✅ Impact: Significantly improved the user experience by replacing the dedicated chat page with a modern floating widget. Fixed a critical backend bug where the AI was not executing tool calls. Implemented a real-time update mechanism for the task list, making the application feel more responsive.
- 🧪 Tests: none
- 📁 Files: 
    - Modified: `backend/src/services/ai_agent.py`, `backend/src/api/chat.py`, `frontend/src/app/layout.tsx`, `frontend/src/context/AuthContext.tsx`, `frontend/src/components/TaskList.tsx`
    - Created: `frontend/src/components/ChatWidget.tsx`
    - Deleted: `frontend/src/app/chat/`
- 🔁 Next prompts: none
- 🧠 Reflection: This was a complex multi-part task that required careful planning and execution across the full stack. Breaking it down into backend, frontend UI, and frontend state management was an effective strategy. The use of a shared context for state synchronization proved to be a clean solution for real-time updates.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): n/a
