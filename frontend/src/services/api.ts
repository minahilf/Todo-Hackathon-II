import { API_URL, authorizedFetch } from '../utils/api'; 

interface SendMessageResponse {
  response: string;
  conversation_id: number;
}

export async function sendMessage(
  message: string,
  token: string, // Add token argument
  conversationId?: number | null
): Promise<SendMessageResponse> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, // Add Authorization header
  };

  const body = JSON.stringify({
    message: message,
    conversation_id: conversationId,
  });

  try {
    const response = await authorizedFetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Details:", JSON.stringify(errorData, null, 2));
        
        const errorMessage = typeof errorData.detail === 'string' 
            ? errorData.detail 
            : JSON.stringify(errorData.detail);
            
        if (response.status === 401) {
            throw new Error("Session expired. Please logout and login again.");
        }
        
        throw new Error(errorMessage || 'Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}