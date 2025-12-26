// frontend/src/components/TaskItem.tsx
"use client";

import React, { useState } from 'react';

// Define the shape of a Task
export interface Task {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onUpdate: (id: number, updates: { completed?: boolean; title?: string }) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedTitle.trim() !== task.title) {
      onUpdate(task.id, { title: editedTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setIsEditing(false);
  };

  return (
    <div
      className={`
        flex items-center justify-between p-5 my-3 rounded-2xl shadow-lg border
        transition-all duration-300
        ${task.completed
          ? 'bg-white/10 backdrop-blur-sm border-white/5'
          : 'bg-white/5 backdrop-blur-md border-white/10'
        }
    `}>
      <div className="flex items-center flex-grow">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => onUpdate(task.id, { completed: e.target.checked })}
          className="h-6 w-6 rounded-full border-gray-300 text-blue-500 focus:ring-blue-400 transition bg-transparent"
        />
        <div className="ml-4 flex-grow">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-2 py-1 bg-slate-800 text-gray-100 placeholder-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
          ) : (
            <h3 className={`text-lg font-semibold text-gray-100 ${task.completed ? 'line-through text-gray-400' : ''}`}>
              {task.title}
            </h3>
          )}
          {task.description && !isEditing && (
            <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-300'}`}>
              {task.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2 ml-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="p-2 text-green-400 hover:text-green-300 transition-colors"
              title="Save"
            >
              ✓
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
              title="Cancel"
            >
              ✗
            </button>
          </>
        ) : (
          <button
            onClick={handleEdit}
            className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
            title="Edit Task"
          >
            ✎
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-red-400 hover:text-red-300 transition-colors"
          title="Delete Task"
        >
          🗑
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
