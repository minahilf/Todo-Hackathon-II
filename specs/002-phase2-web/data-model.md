# Data Model: To-Do Application

This document defines the data entities for the application as derived from the feature specification.

## Entity: Task

Represents a single to-do item.

### Attributes

| Attribute     | Type      | Description                                     | Constraints            |
|---------------|-----------|-------------------------------------------------|------------------------|
| `id`          | Integer   | The unique identifier for the task.             | Primary Key, Auto-incrementing |
| `title`       | String    | The main title or content of the task.          | Required, Not Null     |
| `description` | String    | A longer, optional description for the task.    | Optional, Nullable     |
- `completed`   | Boolean   | The completion status of the task.              | Required, Not Null, Default: `false` |

### Validation Rules

- A `title` must be provided for every task.
- The `completed` status defaults to `false` on creation.

### State Transitions

A `Task` can transition between two states:

1.  **Incomplete** (`completed: false`): The default state.
2.  **Complete** (`completed: true`): The final state.

A task can be moved from `Incomplete` to `Complete` and vice-versa.
