export const API_URL = 'https://minahil-todo-backend.onrender.com';

export async function authorizedFetch(url: string, options?: RequestInit): Promise<Response> {
  const mergedHeaders: Record<string, string> = {
    'Content-Type': 'application/json', 
    ...(options?.headers as any || {}), // Merge existing headers from options
  };

  // Only add Authorization from localStorage IF it's not already provided in options.headers
  if (!mergedHeaders['Authorization']) {
    const tokenFromLocalStorage = localStorage.getItem('access_token');
    if (tokenFromLocalStorage) {
      mergedHeaders['Authorization'] = `Bearer ${tokenFromLocalStorage}`;
    }
  }

  const response = await fetch(url, { ...options, headers: mergedHeaders });

  return response;
}