from sqlmodel import Session, select, col
from src.models.task import Task
from src.db import engine

# --- Helper: Find Task by ID or Name ---
def find_task(session: Session, user_id: int, task_id: int = None, title: str = None):
    if task_id:
        return session.get(Task, task_id)
    
    if title:
        # Step 1: Prioritize finding an INCOMPLETE task that matches the name.
        incomplete_task_statement = select(Task).where(
            Task.user_id == user_id,
            Task.completed == False,
            col(Task.title).ilike(f"%{title}%")
        ).order_by(Task.id.desc())
        
        task = session.exec(incomplete_task_statement).first()
        if task:
            return task

        # Step 2: If no incomplete task is found, fall back to finding ANY task that matches.
        any_task_statement = select(Task).where(
            Task.user_id == user_id, 
            col(Task.title).ilike(f"%{title}%")
        ).order_by(Task.id.desc())
        
        return session.exec(any_task_statement).first()
        
    return None

# --- TOOLS ---

async def add_task(title: str, user_id: int, description: str = None):
    try:
        with Session(engine) as session:
            task = Task(title=title, description=description, completed=False, user_id=user_id)
            session.add(task)
            session.commit()
            session.refresh(task)
            return f"Task added: {task.title}"
    except Exception as e:
        return f"Error: {str(e)}"

async def list_tasks(user_id: int):
    try:
        with Session(engine) as session:
            statement = select(Task).where(Task.user_id == user_id)
            tasks = session.exec(statement).all()
            if not tasks: return "List empty hai."
            return "\n".join([f"- {t.title} (Status: {'Done' if t.completed else 'Pending'})" for t in tasks])
    except Exception as e:
        return f"Error: {str(e)}"

async def complete_task(user_id: int, task_id: int = None, title: str = None):
    """Marks task completed by ID or Title."""
    try:
        with Session(engine) as session:
            task = find_task(session, user_id, task_id, title)
            if not task: return f"Task '{title or task_id}' nahi mila."
            
            task.completed = True
            session.add(task)
            session.commit()
            return f"Task '{task.title}' complete ho gaya!"
    except Exception as e:
        return f"Error: {str(e)}"

async def delete_task(user_id: int, task_id: int = None, title: str = None):
    """Deletes task by ID or Title."""
    try:
        with Session(engine) as session:
            task = find_task(session, user_id, task_id, title)
            if not task: return f"Task '{title or task_id}' nahi mila."
            
            name = task.title
            session.delete(task)
            session.commit()
            return f"Task '{name}' delete kar diya."
    except Exception as e:
        return f"Error: {str(e)}"

async def update_task(user_id: int, new_title: str, task_id: int = None, old_title: str = None):
    """Updates task title. Needs ID or Old Title."""
    try:
        with Session(engine) as session:
            task = find_task(session, user_id, task_id, old_title)
            if not task: return f"Task '{old_title or task_id}' nahi mila."
            
            task.title = new_title
            session.add(task)
            session.commit()
            return f"Task updated to '{new_title}'."
    except Exception as e:
        return f"Error: {str(e)}"