// frontend/src/components/Auth.tsx
"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert('Username and password are required.');
      return;
    }

    if (isLogin) {
      await login(username, password);
    } else {
      const registrationSuccess = await register(username, password);
      if (registrationSuccess) {
        alert('Registration Successful! Please Login.');
        setIsLogin(true);
      }
    }

    // Clear form on successful auth, state managed by AuthContext
    setUsername('');
    setPassword('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      
      <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 p-8 w-full max-w-md">
  
        <h2 className="text-3xl font-bold text-gray-100 mb-6 text-center">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 sr-only" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 text-gray-100 placeholder-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent transition"
              placeholder="Username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 sr-only" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 text-gray-100 placeholder-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent transition"
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 font-semibold text-white bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 rounded-lg shadow-lg hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-transform duration-200"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:text-blue-300 font-medium focus:outline-none"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
