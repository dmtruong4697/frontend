import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useChatStore } from '@/stores/useChatStore';
import { useMatchStore } from '@/stores/useMatchStore';
import { ChatMessage } from '@/types';

export const useWebSocket = () => {
  const ws = useRef<WebSocket | null>(null);
  const token = useAuthStore((state) => state.token);
  const roomID = useMatchStore((state) => state.roomID);
  const user = useAuthStore((state) => state.user);
  
  const {
    addMessage,
    setMessages,
    setConnectionStatus,
    setStrangerTyping,
    setStrangerDisconnected,
  } = useChatStore();

  const connect = useCallback(() => {
    if (!token || !roomID) return;

    if (ws.current?.readyState === WebSocket.OPEN) return;

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/ws?room=${roomID}&token=${token}`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setConnectionStatus(true);
      setStrangerDisconnected(false);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'chat':
            // If the message is from me, I've already added it optimistically.
            if (data.sender_id === 'me') return;

            addMessage({
              id: data.id || Date.now().toString(),
              type: 'chat',
              sender_id: data.sender_id,
              content: data.content as string,
              timestamp: data.created_at || new Date().toISOString(),
              isMe: false,
            });
            break;
          case 'history':
            const history = (data.content as any[]).map((msg, idx) => ({
              id: msg.id || `${Date.now()}-${idx}`,
              type: 'chat' as const,
              sender_id: msg.sender_id,
              content: msg.content,
              timestamp: msg.created_at || new Date().toISOString(),
              isMe: msg.sender_id === "me",
            }));
            setMessages(history);
            break;
          case 'leave':
            setStrangerDisconnected(true);
            addMessage({
              id: Date.now().toString(),
              type: 'system',
              content: 'Stranger has left the chat',
              timestamp: new Date().toISOString(),
              isMe: false,
            });
            break;
          case 'typing':
            setStrangerTyping(true);
            setTimeout(() => setStrangerTyping(false), 2000);
            break;
        }
      } catch (err) {
        console.error('Error parsing WebSocket message', err);
      }
    };

    ws.current.onclose = () => {
      setConnectionStatus(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus(false);
    };
  }, [token, roomID, setConnectionStatus, setStrangerDisconnected, addMessage, setMessages, user?.id, setStrangerTyping]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      // Remove handlers before closing to avoid triggering error/close logic
      ws.current.onopen = null;
      ws.current.onmessage = null;
      ws.current.onclose = null;
      ws.current.onerror = null;
      ws.current.close();
      ws.current = null;
    }
  }, []);

  const sendMessage = useCallback(
    (content: string, type: 'chat' | 'typing' | 'leave' = 'chat') => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const messageId = type === 'chat' ? `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` : undefined;
        
        const messagePayload = {
          id: messageId,
          type,
          sender_id: 'me',
          content,
        };
        ws.current.send(JSON.stringify(messagePayload));

        if (type === 'chat' && messageId) {
           // Optimistically add message
           addMessage({
             id: messageId,
             type: 'chat',
             content,
             sender_id: user?.id,
             timestamp: new Date().toISOString(),
             isMe: true,
           });
        }
      }
    },
    [user?.id, addMessage]
  );

  useEffect(() => {
    if (roomID) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [roomID, connect, disconnect]);

  return { sendMessage, disconnect };
};
