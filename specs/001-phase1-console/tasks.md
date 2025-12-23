---
description: "Task list for feature implementation"
---

# Tasks: Phase 1 Console Todo App

**Input**: Design documents from `/specs/001-phase1-console/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: No automated tests were requested for this phase. All testing is manual based on the independent test criteria for each user story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure.

- [X] T001 Create the project directory `src/`
- [X] T002 Create the main application file `src/main.py`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

- [X] T003 In `src/main.py`, define the in-memory list `tasks = []` to store all task dictionaries.
- [X] T004 In `src/main.py`, define the dictionary structure for a 'Task' (`id`, `title`, `description`, `status`). Add a comment to clarify the structure.
- [X] T005 In `src/main.py`, implement the main application `while True` loop with a placeholder menu for user options ('Add', 'View', 'Update', 'Delete', 'Complete', 'Exit').

---

## Phase 3: User Story 1 - Add a new task (Priority: P1) 🎯 MVP

**Goal**: As a user, I want to add a new task by providing a title and description.

**Independent Test**: Run the app, select "Add Task", enter details, and confirm the task is added. This can be verified in the next phase (View Tasks) or by debugging.

### Implementation for User Story 1

- [X] T006 [US1] In `src/main.py`, implement the menu option to trigger the 'Add Task' functionality.
- [X] T007 [US1] In `src/main.py`, create a function `add_task()` that prompts the user for a task title and description.
- [X] T008 [US1] In `add_task()` within `src/main.py`, implement the logic to: generate a unique ID, set status to 'pending', create the task dictionary, and append it to the `tasks` list.
- [X] T009 [US1] In `add_task()` within `src/main.py`, add a `try-except` block to handle potential input errors and provide user feedback.

**Checkpoint**: User Story 1 is functional. The application can accept and store new tasks.

---

## Phase 4: User Story 2 - View all tasks (Priority: P1)

**Goal**: As a user, I want to see a list of all my tasks in a clear, tabular format.

**Independent Test**: Add one or more tasks, then select "View Tasks". The console should display a formatted table of all tasks with their ID, Title, and Status.

### Implementation for User Story 2

- [X] T010 [US2] In `src/main.py`, implement the menu option to trigger the 'View Tasks' functionality.
- [X] T011 [US2] In `src/main.py`, create a function `view_tasks()` that iterates through the `tasks` list and prints a formatted table of all tasks.
- [X] T012 [US2] In `view_tasks()` within `src/main.py`, handle the case where the `tasks` list is empty, printing a user-friendly message.

**Checkpoint**: User Stories 1 and 2 are functional. Users can add tasks and view them.

---

## Phase 5: User Story 3 - Manage task status (Priority: P2)

**Goal**: As a user, I want to be able to update, delete, or mark a task as 'complete' by using its ID.

**Independent Test**: Add a task, view it to get its ID, then use the manage options (update, complete, delete) with that ID. Viewing the list again should reflect the changes.

### Implementation for User Story 3

- [X] T013 [US3] In `src/main.py`, implement menu options for 'Update Task', 'Delete Task', and 'Complete Task'.
- [X] T014 [US3] In `src/main.py`, create a helper function `find_task_by_id(task_id)` that searches the `tasks` list and returns a task dictionary or `None`.
- [X] T015 [US3] In `src/main.py`, implement `update_task()` which uses `find_task_by_id()` and prompts the user for a new title and description.
- [X] T016 [US3] In `src/main.py`, implement `delete_task()` which uses `find_task_by_id()` to remove a task from the `tasks` list.
- [X] T017 [US3] In `src/main.py`, implement `complete_task()` which uses `find_task_by_id()` to change a task's status to 'complete'.
- [X] T018 [US3] In the management functions (`update`, `delete`, `complete`) in `src/main.py`, add `try-except` blocks and checks to handle cases where a task ID is not found.

**Checkpoint**: All user stories are now independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect the overall user experience.

- [X] T019 In `src/main.py`, refine the main menu presentation and all user prompts for clarity and consistency.
- [X] T020 In `src/main.py`, add comments to each function explaining its purpose, parameters, and return values.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Must be completed first.
- **Foundational (Phase 2)**: Depends on Setup. Blocks all user stories.
- **User Stories (Phase 3-5)**: Depend on Foundational. Can be implemented sequentially (US1 -> US2 -> US3).
- **Polish (Phase 6)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (Add Task)**: No dependencies on other stories.
- **User Story 2 (View Tasks)**: Depends on User Story 1 to have tasks to view.
- **User Story 3 (Manage Tasks)**: Depends on User Stories 1 and 2 to have tasks to manage and a way to see their IDs.

### Parallel Opportunities

Due to the single-file nature of this project (`src/main.py`), parallel execution of tasks is not recommended as it would lead to merge conflicts. Tasks should be completed sequentially.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1.  Complete Phase 1: Setup
2.  Complete Phase 2: Foundational
3.  Complete Phase 3: User Story 1 (Add Task)
4.  Complete Phase 4: User Story 2 (View Tasks)
5.  **STOP and VALIDATE**: The core MVP is now testable. A user can add and see their tasks.

### Incremental Delivery

1.  Complete MVP steps above.
2.  Add Phase 5: User Story 3 (Manage Tasks) -> Test independently.
3.  Add Phase 6: Polish -> Final review.

This ensures a functional application at each stage.