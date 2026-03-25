import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage } from '@/types';

interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  strangerTyping: boolean;
  strangerDisconnected: boolean;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setConnectionStatus: (isConnected: boolean) => void;
  setStrangerTyping: (isTyping: boolean) => void;
  setStrangerDisconnected: (isDisconnected: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isConnected: false,
      strangerTyping: false,
      strangerDisconnected: false,
      addMessage: (message) =>
        set((state) => {
          if (state.messages.find((m) => m.id === message.id)) {
            return state;
          }
          return { messages: [...state.messages, message] };
        }),
      setMessages: (messages) => set({ messages }),
      setConnectionStatus: (isConnected) => set({ isConnected }),
      setStrangerTyping: (strangerTyping) => set({ strangerTyping }),
      setStrangerDisconnected: (strangerDisconnected) =>
        set({ strangerDisconnected }),
      clearChat: () =>
        set({
          messages: [],
          isConnected: false,
          strangerTyping: false,
          strangerDisconnected: false,
        }),
    }),
    {
      name: 'chat-storage',
      // Only persist messages
      partialize: (state) => ({ messages: state.messages }),
    }
  )
);
