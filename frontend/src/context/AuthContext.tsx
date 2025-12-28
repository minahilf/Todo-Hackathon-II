"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { API_URL } from '../utils/api';

const API_BASE_URL = API_URL;

interface AuthContextType {
  user: { id?: number; username: string } | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshCounter: number;
  triggerRefresh: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id?: number; username: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const triggerRefresh = () => {
    setRefreshCounter(prev => prev + 1);
    console.log("🔥 AuthContext: Refresh Signal Triggered! New Count:", refreshCounter + 1);
  };
  
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const formBody = new URLSearchParams();
      formBody.append('username', username);
      formBody.append('password', password);

      // 1. Token maango (Ye aksar root par hota hai, isliye change nahi kiya)
      const response = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      setToken(data.access_token);
      
      // 2. User Details fetch karo (YAHAN '/api' MISSING THA) 🛑 -> ✅
      const userResponse = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: { 'Authorization': `Bearer ${data.access_token}` }
      });
      
      if(!userResponse.ok) throw new Error('Failed to fetch user details after login.');
      const userData = await userResponse.json();

      setUser(userData);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      alert(error instanceof Error ? error.message : 'An unknown error occurred during login');
      return false;
    }
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      // 3. Register request (YAHAN BHI '/api' MISSING THA) 🛑 -> ✅
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }
      return await login(username, password);
    } catch (error) {
      console.error('Registration error:', error);
      alert(error instanceof Error ? error.message : 'An unknown error occurred during registration');
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, refreshCounter, triggerRefresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};