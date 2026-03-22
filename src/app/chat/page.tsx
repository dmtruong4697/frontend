'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMatchStore } from '@/stores/useMatchStore';
import { useChatStore } from '@/stores/useChatStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Button } from '@/components/ui/Button';
import { LogOut, Send, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/components/ui/Button';

export default function ChatPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { roomID, strangerID, resetMatch } = useMatchStore();
  const {
    messages,
    isConnected,
    strangerTyping,
    strangerDisconnected,
    clearChat,
  } = useChatStore();

  const [isHydrated, setIsHydrated] = useState(false);
  const { sendMessage, disconnect } = useWebSocket();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    
    if (!token) {
      router.replace('/login');
    }
    if (!roomID) {
      router.replace('/home');
    }
    
    return () => {
      // Disconnect WS when leaving chat page
      disconnect();
    };
  }, [isHydrated, token, roomID, router, disconnect]);

  useEffect(() => {
    // Scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, strangerTyping]);

  const handleSend = () => {
    if (!input.trim() || !isConnected || strangerDisconnected) return;
    sendMessage(input.trim(), 'chat');
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    } else {
      // Send typing event indicator (throttling could be added here)
      sendMessage('', 'typing');
    }
  };

  const prevRoomID = useRef<string | null>(null);
  useEffect(() => {
    if (roomID && prevRoomID.current && roomID !== prevRoomID.current) {
      clearChat();
    }
    prevRoomID.current = roomID;
  }, [roomID, clearChat]);

  const handleLeave = () => {
    sendMessage('', 'leave'); // Notify server/partner explicitly
    setTimeout(() => {
      disconnect();
      resetMatch();
      clearChat();
      router.replace('/home');
    }, 100); // Small delay to ensure message is sent
  };

  if (!roomID) return null;

  return (
    <div className="flex-1 flex flex-col h-screen bg-cream-50 font-medium">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white/70 backdrop-blur-md border-b border-matcha-100 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-matcha-500 rounded-2xl flex items-center justify-center shadow-inner">
            <span className="text-xl">🍵</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-forest-900 font-bold text-sm">Stranger #{strangerID?.substring(0, 4) || '??'}</h2>
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-matcha-500 animate-pulse" : "bg-rose-500"
              )} />
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                isConnected ? "text-matcha-600" : "text-rose-500"
              )}>
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        <Button variant="danger" onClick={handleLeave} className="text-xs py-1.5 px-4 rounded-xl border-none font-bold">
          <LogOut className="w-4 h-4" />
          <span>Exit</span>
        </Button>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((msg, idx) => {
          if (msg.type === 'system' || msg.type === 'error') {
            return (
              <div key={idx} className="flex justify-center my-2">
                <span className="text-[10px] font-bold bg-matcha-100 text-matcha-600 py-1.5 px-4 rounded-full border border-matcha-200 uppercase tracking-widest">
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id || idx}
              className={cn(
                "flex max-w-[85%] flex-col",
                msg.isMe ? "self-end items-end" : "self-start items-start"
              )}
            >
              <div
                className={cn(
                  "px-4 py-3 rounded-2xl break-words whitespace-pre-wrap shadow-sm text-[15px] leading-relaxed",
                  msg.isMe
                    ? "bg-matcha-500 text-white rounded-tr-none"
                    : "bg-white text-forest-900 rounded-tl-none border-2 border-matcha-100"
                )}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-matcha-400 font-bold mt-1.5 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}

        {strangerTyping && !strangerDisconnected && (
          <div className="flex self-start max-w-[80%] px-4 py-4 bg-white border-2 border-matcha-100 rounded-2xl rounded-tl-none text-matcha-500">
            <div className="flex gap-1.5 items-center h-2">
              <span className="w-2 h-2 bg-matcha-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-matcha-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-matcha-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
        
        {strangerDisconnected && (
          <div className="flex justify-center my-4">
            <div className="bg-rose-50 text-rose-500 border-2 border-rose-100 py-3 px-6 rounded-3xl text-xs font-bold shadow-sm text-center animate-in zoom-in-95 duration-300">
              Stranger has left the tea party. 🍵<br/>
              <span className="opacity-70">Click Exit to find a new friend!</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <div className="px-4 py-4 bg-white/70 backdrop-blur-md border-t border-matcha-100 shrink-0">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isConnected || strangerDisconnected}
            placeholder={strangerDisconnected ? "Disconnected..." : "Send a message..."}
            className="flex-1 bg-white border-2 border-matcha-100 rounded-2xl px-5 py-3 text-forest-900 placeholder:text-matcha-300 outline-none focus:border-matcha-500 transition-all shadow-sm font-medium"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || !isConnected || strangerDisconnected}
            className="rounded-2xl w-14 h-12 !p-0 shrink-0 shadow-md shadow-matcha-200"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
