// frontend/src/components/TaskList.tsx
"use client";

import React, { useState, useEffect } from 'react';
import TaskItem, { Task } from './TaskItem';
import AddTaskForm from './AddTaskForm';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/api';

const BASE_API_URL = `${API_URL}/api`;

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Decouple from refreshCounter; we now use a global event.
  const { token } = useAuth();

  // Helper to get headers easily
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    };
  };

  const fetchTasks = async () => {
    if (!token) {
        setTasks([]); // Clear tasks if no token
        setLoading(false);
        return;
    }
    setLoading(true);
    console.log("🔄 TaskList: Fetching tasks...");
    try {
      const res = await fetch(`${BASE_API_URL}/tasks?timestamp=${new Date().getTime()}`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Effect for the initial fetch when the component mounts or the user logs in
  useEffect(() => {
    fetchTasks();
  }, [token]);

  // Effect to listen for the global refresh event dispatched by other components
  useEffect(() => {
    const handleRefresh = () => {
      console.log("🎉 TaskList: Received Global Refresh Event! Refetching tasks.");
      fetchTasks();
    };

    window.addEventListener("task_refresh_signal", handleRefresh);

    // Cleanup the event listener when the component unmounts to prevent memory leaks
    return () => {
      window.removeEventListener("task_refresh_signal", handleRefresh);
    };
  }, [token]); // Re-add listener if token changes, ensuring fetchTasks has the correct token in its closure

  const handleAddTask = async (title: string, description?: string) => {
    if (!token) return;
    try {
      const response = await fetch(`${BASE_API_URL}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, description, completed: false }),
      });
      if (!response.ok) throw new Error('Failed to add task');
      fetchTasks(); // Re-fetch to get the new list with server-generated ID
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
    }
  };


  const handleUpdateTask = async (id: number, updates: { completed?: boolean; title?: string }) => {
    if (!token) return;
    try {
      const response = await fetch(`${BASE_API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update task');
      fetchTasks(); // Re-fetch to ensure consistency
    } catch (err)
 {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!token) return;
    try {
      const response = await fetch(`${BASE_API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete task');
      fetchTasks(); // Re-fetch to ensure consistency
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  // --- Render Logic ---
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