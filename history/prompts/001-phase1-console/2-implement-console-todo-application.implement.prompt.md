--- 
id: 2
title: Implement Console Todo Application
stage: implement
date: 2025-12-23
surface: agent
model: gemini-pro
feature: 001-phase1-console
branch: 001-phase1-console
user: Minahil Fatima
command: "/sp.implement gemini \"Act as a Senior Python Developer. Read 'specs/001-phase1-console/spec.md' and the Task List you just generated. Goal: Execute tasks T001 to T020 to build the complete Phase 1 Console App. Output: Write the FULL, working code for 'src/main.py'. It must include: 1. The 'while True' menu loop. 2. In-memory list storage. 3. Functions for Add, View, Update, Delete, and Complete. 4. Error handling (try-except). Just give me the Python code block.\""
labels: [implement, python, console-app]
links:
  spec: specs/001-phase1-console/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - .gitignore
  - src/main.py
  - specs/001-phase1-console/tasks.md
tests:
  - none
---

## Prompt

/sp.implement gemini "Act as a Senior Python Developer. Read 'specs/001-phase1-console/spec.md' and the Task List you just generated.

Goal: Execute tasks T001 to T020 to build the complete Phase 1 Console App.

Output: Write the FULL, working code for 'src/main.py'. It must include:
1. The 'while True' menu loop.
2. In-memory list storage.
3. Functions for Add, View, Update, Delete, and Complete.
4. Error handling (try-except).

Just give me the Python code block."

## Response snapshot

```python
import uuid

# In-memory storage for tasks
tasks = []

# Data structure for a 'Task':
# {
#   'id': string,
#   'title': string,
#   'description': string,
#   'status': string ('pending' or 'complete')
# }

def find_task_by_id(task_id):
    """
    Searches the tasks list for a task with the given ID.
    
    Parameters:
    task_id (str): The ID of the task to find.
    
    Returns:
    dict or None: The task dictionary if found, otherwise None.
    """
    for task in tasks:
        if task['id'] == task_id:
            return task
    return None

def add_task():
    """
    Prompts the user for a title and description, then creates a new task
    and adds it to the in-memory list.
    """
    print("\n--- Add a New Task ---")
    try:
        title = input("Enter task title: ")
        if not title:
            print("Error: Title cannot be empty.")
            return
            
        description = input("Enter task description: ")
        
        new_task = {
            'id': str(uuid.uuid4())[:8], # Generate a short unique ID
            'title': title,
            'description': description,
            'status': 'pending'
        }
        tasks.append(new_task)
        print(f"Success: Task '{title}' added with ID: {new_task['id']}")
        
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

def view_tasks():
    """
    Displays all tasks in a formatted table. If no tasks exist, it
    prints a friendly message.
    """
    print("\n--- View All Tasks ---")
    if not tasks:
        print("No tasks to display. Why not add one?")
        return
        
    print(f"{ 'ID':<10} | { 'Title':<30} | { 'Status':<12}")
    print("-" * 58)
    for task in tasks:
        print(f"{task['id']:<10} | {task['title']:<30} | {task['status']:<12}")

def update_task():
    """
    Prompts the user for a task ID and allows them to update the
    title and description of the corresponding task.
    """
    print("\n--- Update a Task ---")
    task_id = input("Enter the ID of the task to update: ")
    
    try:
        task = find_task_by_id(task_id)
        if task is None:
            print("Error: Task not found.")
            return
            
        print(f"Updating task: {task['title']}")
        new_title = input(f"Enter new title (current: {task['title']}): ")
        new_description = input(f"Enter new description (current: {task['description']}): ")
        
        task['title'] = new_title if new_title else task['title']
        task['description'] = new_description if new_description else task['description']
        
        print("Success: Task updated.")
        
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

def delete_task():
    """
    Prompts the user for a task ID and removes the corresponding task
    from the in-memory list.
    """
    print("\n--- Delete a Task ---")
    task_id = input("Enter the ID of the task to delete: ")
    
    try:
        task = find_task_by_id(task_id)
        if task is None:
            print("Error: Task not found.")
            return
            
        tasks.remove(task)
        print(f"Success: Task '{task['title']}' has been deleted.")
        
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

def complete_task():
    """
    Prompts the user for a task ID and changes the status of the
    corresponding task to 'complete'.
    """
    print("\n--- Complete a Task ---")
    task_id = input("Enter the ID of the task to mark as complete: ")
    
    try:
        task = find_task_by_id(task_id)
        if task is None:
            print("Error: Task not found.")
            return
            
        task['status'] = 'complete'
        print(f"Success: Task '{task['title']'}' marked as complete.")
        
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

def main_menu():
    """
    Displays the main menu and handles user input for navigating the app.
    This function runs in a continuous loop until the user chooses to exit.
    """
    while True:
        print("\n===== Console Todo App =====")
        print("1. Add Task")
        print("2. View Tasks")
        print("3. Update Task")
        print("4. Delete Task")
        print("5. Complete Task")
        print("6. Exit")
        print("==========================")
        
        choice = input("Enter your choice (1-6): ")
        
        if choice == '1':
            add_task()
        elif choice == '2':
            view_tasks()
        elif choice == '3':
...
