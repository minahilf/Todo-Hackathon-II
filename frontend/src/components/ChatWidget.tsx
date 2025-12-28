"use client";

import { useState, useRef, useEffect } from 'react';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactMarkdown from 'react-markdown';
import { MessageSquare, X, Lightbulb, User as UserIcon } from 'lucide-react';
import { sendMessage } from '../services/api';
import { useAuth } from '@/context/AuthContext';

// 1. Types Define kiye taake TypeScript khush rahe
interface Message {
  role: 'user' | 'ai';
  content: string;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();

  // --- REQUIREMENT 2: PRIVACY FIX (LOADING) ---
  useEffect(() => {
    // This effect runs on user change.
    // If user is null or invalid, it clears the message state immediately.
    const STORAGE_KEY = user?.id ? `chat_history_${user.id}` : null;
    
    if (!STORAGE_KEY) { 
      setMessages([]);
      return;
    }

    // If there is a valid user, load their specific history.
    const savedChat = localStorage.getItem(STORAGE_KEY);
    if (savedChat) {
      try {
        setMessages(JSON.parse(savedChat));
      } catch (e) {
        console.error("Chat load error", e);
        setMessages([]); // Start fresh on error
      }
    } else {
      setMessages([]); // No history for this user
    }
  }, [user]); // Dependency on `user` is crucial for this logic.

  // --- REQUIREMENT 2: PRIVACY FIX (SAVING) ---
  useEffect(() => {
    // Only save messages if there is a valid, logged-in user.
    if (!user || !user.id) {
      return;
    }
    const STORAGE_KEY = `chat_history_${user.id}`;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages, user]); // Dependency on `messages` and `user`.

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // --- REQUIREMENT 1: AUTH FIX ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Get token directly from localStorage to prevent using a stale state value.
    const directToken = localStorage.getItem("access_token");
    
    // The backend will validate the token. If it's missing, the user is not logged in.
    if (!directToken) {
      setMessages((prev) => [...prev, { role: 'ai', content: 'Bro pehle login to krlo!' }]);
      return;
    }

    const userMessage = input;
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      // Pass the directly retrieved token to the API call.
      const response = await sendMessage(userMessage, directToken, conversationId);
      setMessages((prev) => [...prev, { role: 'ai', content: response.response }]);
      setConversationId(response.conversation_id);
      
      setTimeout(() => {
        console.log("🚀 Dispatching Global Refresh Event...");
        window.dispatchEvent(new Event("task_refresh_signal"));
      }, 1000);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages((prev) => [...prev, { role: 'ai', content: 'Yaar server connect nahi ho raha.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI (NO CHANGES) ---
  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110"
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-6 z-40 w-80 md:w-96 h-125 bg-gray-900 text-gray-100 rounded-xl shadow-2xl flex flex-col border border-gray-700">
          
          <header className="bg-gray-800 p-4 rounded-t-xl shadow-md flex justify-between items-center border-b border-gray-700">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h1 className="text-lg font-bold text-white">AI Assistant</h1>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
            </button>
          </header>

          <main className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-70">
                <Lightbulb size={48} className="mb-4 text-yellow-500" />
                <p className="text-center font-medium">Add a Task</p>
                <p className="text-xs mt-1">"Add a task to Bring Milk"</p>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div key={index} className={cn('flex items-start gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                
                {msg.role === 'ai' && (
                    <div className="shrink-0 mt-1">
                        <Lightbulb className="w-6 h-6 rounded-full bg-blue-600 p-1 text-white" />
                    </div>
                )}
                
                <div className={cn('rounded-2xl px-4 py-2 max-w-[85%] text-sm shadow-sm', 
                    msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-700 text-gray-100 rounded-tl-none border border-gray-600'
                )}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {msg.role === 'user' && (
                    <div className="shrink-0 mt-1">
                        <UserIcon className="w-6 h-6 rounded-full bg-green-600 p-1 text-white" />
                    </div>
                )}
              </div>
            ))}

            {isLoading && (
                <div className="flex justify-start items-center gap-3">
                    <div className="bg-gray-700 text-gray-300 text-xs rounded-full px-3 py-1 animate-pulse">
                        Thinking... 🧠
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </main>

          <footer className="bg-gray-800 p-3 rounded-b-xl border-t border-gray-700">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2.5 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm border border-gray-600"
                placeholder={isLoading ? "wait..." : "Type..."}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm" 
                disabled={isLoading}
              >
                Send
              </button>
            </form>
          </footer>
        </div>
      )}
    </>
  );
}