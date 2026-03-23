'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMatchStore } from '@/stores/useMatchStore';
import { useChatStore } from '@/stores/useChatStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Button } from '@/components/ui/Button';
import { LogOut, Send } from 'lucide-react';
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

  useEffect(() => { setIsHydrated(true); }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (!token) { router.replace('/login'); }
    if (!roomID) { router.replace('/home'); }
    return () => { disconnect(); };
  }, [isHydrated, token, roomID, router, disconnect]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, strangerTyping]);

  const prevRoomID = useRef<string | null>(null);
  useEffect(() => {
    if (roomID && prevRoomID.current && roomID !== prevRoomID.current) {
      clearChat();
    }
    prevRoomID.current = roomID;
  }, [roomID, clearChat]);

  const handleSend = () => {
    if (!input.trim() || !isConnected || strangerDisconnected) return;
    sendMessage(input.trim(), 'chat');
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    } else {
      sendMessage('', 'typing');
    }
  };

  const handleLeave = () => {
    sendMessage('', 'leave');
    setTimeout(() => {
      disconnect();
      resetMatch();
      clearChat();
      router.replace('/home');
    }, 100);
  };

  if (!roomID) return null;

  const strangerLabel = `Stranger #${strangerID?.substring(0, 4) || '??'}`;

  return (
    <div
      className="flex flex-col"
      style={{ height: '100dvh', background: 'var(--background)' }}
    >
      {/* ── Header ── */}
      <header
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1.5px solid #EDE8E1',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
              style={{ background: 'linear-gradient(135deg,#FDD4B3,#F4A261)', boxShadow: '0 2px 8px rgba(244,162,97,0.3)' }}
            >
              👤
            </div>
            {/* Online dot */}
            <span
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
              style={{
                background: isConnected ? '#6BBFA0' : '#F08080',
                animation: isConnected ? 'pulseDot 2s ease-in-out infinite' : 'none',
              }}
            />
          </div>

          <div>
            <p className="text-sm font-black" style={{ color: '#2E2E2E' }}>{strangerLabel}</p>
            <p
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: isConnected ? '#5A9E87' : '#D96060' }}
            >
              {isConnected ? '● Online' : '○ Offline'}
            </p>
          </div>
        </div>

        <Button variant="danger" onClick={handleLeave} className="text-xs px-4 py-2 gap-1.5">
          <LogOut className="w-3.5 h-3.5" />
          Exit
        </Button>
      </header>

      {/* ── Messages ── */}
      <main
        className="flex-1 overflow-y-auto flex flex-col gap-3 px-4 py-4"
        style={{ background: 'var(--background)' }}
      >
        {messages.map((msg, idx) => {
          // System / error messages
          if (msg.type === 'system' || msg.type === 'error') {
            return (
              <div key={idx} className="flex justify-center my-1 animate-fade-in">
                <span
                  className="text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest"
                  style={{ background: '#EDE8E1', color: '#8A8A8A' }}
                >
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id || idx}
              className={cn(
                'flex flex-col max-w-[78%] animate-fade-in-up',
                msg.isMe ? 'self-end items-end' : 'self-start items-start'
              )}
            >
              <div
                className="px-4 py-3 break-words whitespace-pre-wrap text-sm leading-relaxed font-semibold"
                style={
                  msg.isMe
                    ? {
                        background: 'linear-gradient(135deg,#8DD1B9,#7CB9A0)',
                        color: '#fff',
                        borderRadius: '1.25rem 1.25rem 0.375rem 1.25rem',
                        boxShadow: '0 2px 12px rgba(124,185,160,0.3)',
                      }
                    : {
                        background: '#fff',
                        color: '#2E2E2E',
                        borderRadius: '1.25rem 1.25rem 1.25rem 0.375rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        border: '1.5px solid #EDE8E1',
                      }
                }
              >
                {msg.content}
              </div>
              <span
                className="text-[10px] font-bold mt-1 px-1"
                style={{ color: '#B0A89E' }}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}

        {/* Typing indicator */}
        {strangerTyping && !strangerDisconnected && (
          <div className="self-start animate-fade-in">
            <div
              className="flex items-center gap-1.5 px-4 py-3"
              style={{
                background: '#fff',
                borderRadius: '1.25rem 1.25rem 1.25rem 0.375rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1.5px solid #EDE8E1',
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: '#8DD1B9',
                    animation: 'bounceDot 1.2s ease-in-out infinite',
                    animationDelay: `${i * 0.18}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Disconnected banner */}
        {strangerDisconnected && (
          <div className="flex justify-center my-3 animate-slide-in-bottom">
            <div
              className="px-6 py-3 text-xs font-bold text-center"
              style={{
                background: '#FDE8E8',
                color: '#D96060',
                borderRadius: '1.5rem',
                border: '1.5px solid #F5C0C0',
                boxShadow: '0 2px 8px rgba(240,128,128,0.15)',
              }}
            >
              Stranger has left the chat 👋
              <br />
              <span style={{ opacity: 0.7 }}>Click Exit to find someone new!</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* ── Input Bar ── */}
      <div
        className="shrink-0 px-4 py-3"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px)',
          borderTop: '1.5px solid #EDE8E1',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.04)',
        }}
      >
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isConnected || strangerDisconnected}
            placeholder={
              strangerDisconnected
                ? 'Chat ended…'
                : !isConnected
                ? 'Connecting…'
                : 'Type a message…'
            }
            className="flex-1 px-5 py-3 text-sm font-semibold outline-none transition-all duration-200"
            style={{
              background: '#F7F4F0',
              border: '2px solid #EDE8E1',
              borderRadius: '999px',
              color: '#2E2E2E',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#7CB9A0'; e.target.style.boxShadow = '0 0 0 3px rgba(124,185,160,0.15)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#EDE8E1'; e.target.style.boxShadow = 'none'; }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !isConnected || strangerDisconnected}
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 active:scale-90"
            style={{
              background: !input.trim() || !isConnected || strangerDisconnected
                ? '#EDE8E1'
                : 'linear-gradient(135deg,#8DD1B9,#7CB9A0)',
              color: !input.trim() || !isConnected || strangerDisconnected ? '#B0A89E' : '#fff',
              boxShadow: !input.trim() || !isConnected || strangerDisconnected
                ? 'none'
                : '0 4px 16px rgba(124,185,160,0.35)',
            }}
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
