// frontend/src/components/TaskList.tsx
"use client";

import React, { useState, useEffect } from 'react';
import TaskItem, { Task } from './TaskItem';
import AddTaskForm from './AddTaskForm';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

const API_URL = "http://127.0.0.1:8000/api";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token, logout } = useAuth(); // Get token and logout function from AuthContext

  const authorizedFetch = async (url: string, options?: RequestInit) => {
    const headers = {
      ...(options?.headers || {}),
      'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      logout(); // Auto-logout on 401 Unauthorized
      throw new Error('Unauthorized: Please log in again.');
    }
    return response;
  };

  const fetchTasks = async () => {
    if (!token) { // Don't fetch if no token
      setLoading(false);
      return;
    }
    try {
      const response = await authorizedFetch(`${API_URL}/tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks from the server.');
      }
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]); // Re-fetch tasks when token changes

  const handleAddTask = async (title: string, description?: string) => {
    if (!token) return;
    try {
      const response = await authorizedFetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, completed: false }),
      });
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
    }
  };

  const handleUpdateTask = async (id: number, updates: { completed?: boolean; title?: string }) => {
    if (!token) return;
    try {
      const response = await authorizedFetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      const updatedTask = await response.json();
      setTasks(tasks.map(t => (t.id === id ? updatedTask : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!token) return;
    try {
      const response = await authorizedFetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const renderStatus = () => {
    if (loading) {
      return <div className="text-center p-6 bg-white/5 backdrop-blur-md rounded-2xl shadow-md text-gray-400">Loading tasks...</div>;
    }
    if (error) {
      return <div className="text-center p-6 bg-red-900/30 backdrop-blur-md rounded-2xl shadow-md text-red-300">Error: {error}</div>;
    }
    if (tasks.length === 0) {
      return (
        <div className="text-center p-10 bg-white/5 backdrop-blur-md rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-200">All Clear!</h3>
          <p className="text-gray-400 mt-2">You have no tasks. Add one above to get started.</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-5">
      <AddTaskForm onAddTask={handleAddTask} />
      
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>

      {tasks.length === 0 && renderStatus()}
    </div>
  );
};

export default TaskList;
