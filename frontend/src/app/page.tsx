"use client"; // This component needs client-side interactivity

import React from 'react';
import TaskList from "@/components/TaskList";
import Auth from "@/components/Auth";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Main Dashboard component after successful login
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="w-full max-w-3xl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-bold text-gray-100 drop-shadow-md">
          Todo List
        </h1>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, {user.username}!</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      <TaskList />
    </div>
  );
};

export default function HomePage() {
  return (
    <AuthProvider>
      <AuthConditionalRenderer />
    </AuthProvider>
  );
}

const AuthConditionalRenderer: React.FC = () => {
  const { token } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-16 bg-slate-950 text-white">
      {token ? <Dashboard /> : <Auth />}
    </main>
  );
};
