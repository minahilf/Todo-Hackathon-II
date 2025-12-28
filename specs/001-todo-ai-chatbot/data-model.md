# Data Model: Todo AI Chatbot (Stateless + MCP)

**Date**: 2025-12-26
**Feature**: [specs/001-todo-ai-chatbot/spec.md](specs/001-todo-ai-chatbot/spec.md)
**Plan**: [specs/001-todo-ai-chatbot/plan.md](specs/001-todo-ai-chatbot/plan.md)

## Entities

### Task

**Description**: Represents a single todo item belonging to a user.

**Attributes**:
*   `id`: Integer, primary key, auto-incrementing.
*   `title`: String, required, indexed. The short description of the task.
*   `description`: String, optional. A longer description for the task.
*   `completed`: Boolean, default `False`. Indicates if the task is finished.
*   `user_id`: Integer, foreign key to `User.id`. Links the task to its owner.

**Relationships**:
*   Many-to-one with `User` (a User can have many Tasks, a Task belongs to one User).

### Conversation

**Description**: Represents a chat session between a user and the AI chatbot.

**Attributes**:
*   `id`: Integer, primary key, auto-incrementing.
*   `user_id`: Integer, foreign key to `User.id`. Links the conversation to the user.

**Relationships**:
*   Many-to-one with `User` (a User can have many Conversations, a Conversation belongs to one User).
*   One-to-many with `Message` (a Conversation can have many Messages).

### Message

**Description**: Represents a single message within a conversation, sent by either the user or the chatbot.

**Attributes**:
*   `id`: Integer, primary key, auto-incrementing.
*   `conversation_id`: Integer, foreign key to `Conversation.id`. Links the message to its conversation.
*   `sender`: String (e.g., 'user', 'bot'), required. Indicates who sent the message.
*   `content`: String, required. The text content of the message.
*   `timestamp`: Datetime, required, default to current time. Records when the message was sent.

**Relationships**:
*   Many-to-one with `Conversation` (a Message belongs to one Conversation).
