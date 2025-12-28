import google.generativeai as genai
from google.generativeai import protos
import os
from dotenv import load_dotenv
from pathlib import Path
import asyncio
import json
import time

from src.services import mcp_tools

# --- 1. SETUP ---
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)
api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)
else:
    print("❌ GEMINI_API_KEY not found.")

# --- 2. TOOLS DEFINITION ---
def add_task(title: str = None, description: str = None): pass
def list_tasks(): pass
def complete_task(task_id: int = None, title: str = None): pass
def delete_task(task_id: int = None, title: str = None): pass
def update_task(new_title: str, task_id: int = None, old_title: str = None): pass

ai_tools_definitions = [add_task, list_tasks, complete_task, delete_task, update_task]

AVAILABLE_TOOLS = {
    "add_task": mcp_tools.add_task,
    "list_tasks": mcp_tools.list_tasks,
    "complete_task": mcp_tools.complete_task,
    "delete_task": mcp_tools.delete_task,
    "update_task": mcp_tools.update_task,
}

# --- 3. SYSTEM PROMPT ---
SYSTEM_PROMPT = (
    "You are a friendly Todo Assistant. You understand English and Roman Urdu. "
    "1. When user says 'add task...', extract the main intent as the task title. "
    "2. Example: 'yar kal gym jana hai' -> Call add_task(title='Kal gym jana hai'). "
    "3. Be concise. "
    "4. If you are unsure about arguments, put the main text in 'title'."
)

# --- 4. DYNAMIC MODEL DISCOVERY (HYBRID PRIORITY) ---
def get_available_models():
    """
    Constructs a model list with 'gemini-1.5-flash' as the hardcoded priority,
    followed by other dynamically discovered models.
    """
    try:
        print("🔍 Constructing hybrid priority model list...")
        
        # 1. Start with the most stable free model explicitly
        priority_model = 'gemini-1.5-flash'
        
        # 2. Get all other usable models from the API
        other_models = [
            model.name for model in genai.list_models() 
            if 'generateContent' in model.supported_generation_methods
        ]
        
        # 3. Combine and de-duplicate
        final_model_list = [priority_model]
        for model in other_models:
            if model not in final_model_list:
                final_model_list.append(model)

        print(f"✅ Hybrid priority model list: {final_model_list}")
        return final_model_list

    except Exception as e:
        print(f"⚠️ Error listing models: {e}. Using hardcoded fallback.")
        return ['gemini-1.5-flash']


# --- 5. AGENT LOGIC (WITH HYBRID PRIORITY FALLBACK) ---
async def get_chat_response(user_id: int, history: list):
    if not api_key: return "Error: API Key missing."

    model_candidates = get_available_models()
    mini_history = history[-6:] if len(history) > 6 else history
    prompt = history[-1]['parts'][0]['text']

    action_performed = False

    for model_name in model_candidates:
        try:
            print(f"Attempting with model: {model_name}...")
            
            model = genai.GenerativeModel(
                model_name=model_name,
                system_instruction=SYSTEM_PROMPT,
                tools=ai_tools_definitions
            )

            chat = model.start_chat(history=mini_history)
            response = await asyncio.to_thread(chat.send_message, prompt)

            # --- Tool Handling Loop ---
            while response.candidates[0].content.parts[0].function_call:
                function_call = response.candidates[0].content.parts[0].function_call
                tool_name = function_call.name
                args = dict(function_call.args)
                
                print(f"🛠️ Tool Call: {tool_name} | Args: {args}")

                if tool_name in AVAILABLE_TOOLS:
                    actual_function = AVAILABLE_TOOLS[tool_name]
                    args["user_id"] = user_id
                    
                    if "description" in args and "title" not in args:
                        args["title"] = args.pop("description")
                    if "title" not in args and tool_name in ["add_task", "update_task"]:
                        args["title"] = "New Task"

                    if tool_name == "update_task":
                        if "title" in args and "new_title" not in args:
                            args["new_title"] = args["title"]
                        if "title" in args:
                            del args["title"]

                    tool_result = await actual_function(**args)
                    action_performed = True

                    response = await asyncio.to_thread(
                        chat.send_message,
                        protos.Part(
                            function_response=protos.FunctionResponse(
                                name=tool_name,
                                response={"content": json.dumps({"output": str(tool_result)})}
                            )
                        )
                    )
                else:
                    raise ValueError(f"Error: AI tried to call an unknown tool '{tool_name}'.")

            return response.text # Success

        except Exception as e:
            print(f"❌ Failed {model_name}: {str(e)}")

            if action_performed:
                print("🔴 Action was performed, but response generation failed. Stopping to prevent duplicates.")
                return "Action completed, but the AI timed out." # Return a user-friendly message
            
            continue # Try the next model

    # This is returned only if the loop completes (all models failed)
    return "All AI models are currently busy. Please try again later."