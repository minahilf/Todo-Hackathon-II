// frontend/src/components/AddTaskForm.tsx
"use client";

import React, { useState } from 'react';

interface AddTaskFormProps {
  onAddTask: (title: string, description?: string) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    onAddTask(title, description);
    setTitle('');
    setDescription('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 my-4 bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border border-white/10"
    >
      <h2 className="text-2xl font-bold mb-5 text-gray-100">Add New Task</h2>
      <div className="space-y-4">
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 text-gray-100 placeholder-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Task Title"
          required
        />
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 text-gray-100 placeholder-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Description (Optional)"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-3 mt-5 font-semibold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-lg shadow-lg hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-transform duration-200"
      >
        Add Task
      </button>
    </form>
  );
};

export default AddTaskForm;
