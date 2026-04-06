'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMatchStore } from '@/stores/useMatchStore';
import { useChatStore } from '@/stores/useChatStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useToastStore } from '@/stores/useToastStore';
import { api } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogOut, Send, Flag, Sparkles } from 'lucide-react';
import { cn } from '@/components/ui/Button';
import LanguagePicker from '@/components/ui/LanguagePicker';
import { useLocaleStore } from '@/stores/useLocaleStore';
import { translations } from '@/locales/translations';

export default function ChatPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { roomID, resetMatch } = useMatchStore();
  const {
    messages,
    isConnected,
    strangerTyping,
    strangerDisconnected,
    clearChat,
  } = useChatStore();
  const { locale } = useLocaleStore();

  const [isHydrated, setIsHydrated] = useState(false);
  const { sendMessage, disconnect } = useWebSocket();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setIsHydrated(true); }, []);

  const t = translations[locale]?.chat || translations.en.chat;

  const REPORT_REASONS = [
    { code: 'spam', label: isHydrated ? t.reportSpam : 'Spam/Scam' },
    { code: 'harassment', label: isHydrated ? t.reportHarassment : 'Harassment' },
    { code: 'hate_speech', label: isHydrated ? t.reportHate : 'Hate Speech' },
    { code: 'inappropriate', label: isHydrated ? t.reportInappropriate : 'Inappropriate Content' },
    { code: 'other', label: isHydrated ? t.reportOther : 'Other' },
  ] as const;

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<(typeof REPORT_REASONS)[number]['code'] | ''>('');
  const [otherReason, setOtherReason] = useState('');
  const [reportError, setReportError] = useState<string | null>(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const { addToast } = useToastStore();

  useEffect(() => {
    if (!isHydrated) return;
    if (!token) { router.replace('/'); }
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
    const val = input.trim();
    if (!val || !isConnected || strangerDisconnected) return;
    setInput('');
    sendMessage(val, 'chat');
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

  const handleOpenReport = () => {
    setIsReportOpen(true);
    setSelectedReason('');
    setOtherReason('');
    setReportError(null);
    setIsSubmittingReport(false);
  };

  const handleCloseReport = () => {
    if (isSubmittingReport) return;
    setIsReportOpen(false);
    setReportError(null);
  };

  const handleConfirmReport = async () => {
    if (!roomID) {
      setReportError('Missing room session.');
      return
    }

    const selected = REPORT_REASONS.find((r) => r.code === selectedReason);
    const isOther = selectedReason === 'other';
    const finalReason = isOther ? otherReason.trim() : (selected?.label ?? '').trim();

    if (!selectedReason) {
      setReportError('Please select a reason.');
      return;
    }

    if (!finalReason) {
      setReportError(isOther ? 'Please enter the reason in Other.' : 'Invalid reason.');
      return;
    }

    const chatHistory = messages
      .filter((m) => m.type === 'chat' || m.type === 'system')
      .map((m) => ({
        type: m.type,
        sender_id: m.sender_id ?? '',
        content: m.content,
        timestamp: m.timestamp,
      }));

    setIsSubmittingReport(true);
    setReportError(null);

    const payload = {
      room_id: roomID,
      reason: finalReason,
      chat_history: chatHistory,
    };

    try {
      await api.post('/report', payload);
      addToast(isHydrated ? t.toastReportSuccess : 'Report submitted.', 'success');
      handleLeave();
    } catch (err) {
      setReportError('Failed to submit report. Please try again.');
    } finally {
      setIsSubmittingReport(false);
      setIsReportOpen(false);
    }
  };

  if (!roomID) return null;

  const strangerLabel = isHydrated ? t.stranger : 'Stranger';

  return (
    <>
      <div
        className="fixed inset-0 flex flex-col overflow-hidden"
        style={{ background: 'var(--background)' }}
      >
        {/* ── Header ── */}
        <header
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1.5px solid #E2E0F0',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                style={{ background: 'linear-gradient(135deg,#FFCFDF,#F48FAD)', boxShadow: '0 2px 8px rgba(244,143,173,0.3)' }}
              >
                👤
              </div>
              {/* Online dot */}
              <span
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                style={{
                  background: isConnected ? '#7C6EF0' : '#F08080',
                  animation: isConnected ? 'pulseDot 2s ease-in-out infinite' : 'none',
                }}
              />
            </div>

            <div>
              <p className="text-sm font-black" style={{ color: '#1E1C2E' }}>{strangerLabel}</p>
              <p
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: isConnected ? '#6451D8' : '#D96060' }}
              >
                {isConnected ? (isHydrated ? t.online : '● Online') : (isHydrated ? t.offline : '○ Offline')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isHydrated && <LanguagePicker />}
            <Button
              variant="ghost"
              onClick={handleOpenReport}
              disabled={isSubmittingReport}
              className="text-xs px-4 py-2 gap-1.5"
            >
              <Flag className="w-3.5 h-3.5" />
              {isHydrated ? t.reportBtn : 'Report'}
            </Button>

            <Button variant="danger" onClick={handleLeave} className="text-xs px-4 py-2 gap-1.5">
              <LogOut className="w-3.5 h-3.5" />
              {isHydrated ? t.exitBtn : 'Exit'}
            </Button>
          </div>
        </header>

        {/* ── Messages ── */}
        <main
          className="flex-1 overflow-y-auto flex flex-col gap-3 px-4 py-4"
          style={{ background: 'var(--background)' }}
        >
          {messages.map((msg, idx) => {
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
                        background: 'linear-gradient(135deg,#A89BFF,#7C6EF0)',
                        color: '#fff',
                        borderRadius: '1.25rem 1.25rem 0.375rem 1.25rem',
                        boxShadow: '0 2px 12px rgba(124,110,240,0.3)',
                      }
                      : {
                        background: '#fff',
                        color: '#1E1C2E',
                        borderRadius: '1.25rem 1.25rem 1.25rem 0.375rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        border: '1.5px solid #E2E0F0',
                      }
                  }
                >
                  {msg.content}
                </div>
                {idx === messages.length - 1 && (
                  <span
                    className="text-[10px] font-bold mt-1 px-1"
                    style={{ color: '#B0A89E' }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
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
                  border: '1.5px solid #E2E0F0',
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: '#A89BFF',
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
                {isHydrated ? t.strangerLeft : 'Stranger has left the chat 👋'}
                <br />
                <span style={{ opacity: 0.7 }}>{isHydrated ? t.strangerLeftSub : 'Click Exit to find someone new!'}</span>
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
            borderTop: '1.5px solid #E2E0F0',
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
                  ? (isHydrated ? t.chatEnded : 'Chat ended…')
                  : !isConnected
                    ? (isHydrated ? t.connecting : 'Connecting…')
                    : (isHydrated ? t.typeMessage : 'Type a message…')
              }
              className="flex-1 px-5 py-3 text-base font-semibold outline-none transition-all duration-200"
              style={{
                background: '#F8F7FF',
                border: '2px solid #E2E0F0',
                borderRadius: '999px',
                color: '#1E1C2E',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#7C6EF0'; e.target.style.boxShadow = '0 0 0 3px rgba(124,110,240,0.15)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#E2E0F0'; e.target.style.boxShadow = 'none'; }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || !isConnected || strangerDisconnected}
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 active:scale-90"
              style={{
                background: !input.trim() || !isConnected || strangerDisconnected
                  ? '#EEEDF8'
                  : 'linear-gradient(135deg,#A89BFF,#7C6EF0)',
                color: !input.trim() || !isConnected || strangerDisconnected ? '#A8A6C0' : '#fff',
                boxShadow: !input.trim() || !isConnected || strangerDisconnected
                  ? 'none'
                  : '0 4px 16px rgba(124,110,240,0.35)',
              }}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Report Modal ── */}
      {isReportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(10px)' }}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="w-full max-w-md px-4 py-5 rounded-3xl border-2 border-warm-100 bg-white"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-base font-black" style={{ color: '#1E1C2E' }}>
                  {isHydrated ? t.reportTitle : 'Report chat'}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#7C6EF0' }}>
                  {isHydrated ? t.reportSelectLabel : 'Select a reason'}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseReport}
                disabled={isSubmittingReport}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-warm-50 transition-colors disabled:opacity-50"
                style={{ color: '#1E1C2E' }}
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                {REPORT_REASONS.map((r) => {
                  const isSelected = selectedReason === r.code;
                  return (
                    <button
                      key={r.code}
                      type="button"
                      onClick={() => {
                        setSelectedReason(r.code);
                        setReportError(null);
                      }}
                      disabled={isSubmittingReport}
                      className={cn(
                        'w-full text-left px-4 py-3 rounded-2xl font-semibold text-sm border-2 transition-all duration-200',
                        isSelected
                          ? 'border-sage-500 bg-sage-50 text-sage-700'
                          : 'border-warm-100 bg-white hover:border-sage-200 text-warm-900'
                      )}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>

              {selectedReason === 'other' && (
                <div className="pt-1">
                  <Input
                    label={isHydrated ? t.reportOther : "Other reason"}
                    placeholder={isHydrated ? t.reportOtherPlaceholder : "Describe the issue in English"}
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    disabled={isSubmittingReport}
                  />
                </div>
              )}

              {reportError && (
                <div className="text-xs font-bold" style={{ color: '#D96060' }}>
                  {reportError}
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-5">
              <Button
                variant="ghost"
                onClick={handleCloseReport}
                disabled={isSubmittingReport}
                className="flex-1"
              >
                {isHydrated ? t.reportCancel : "Cancel"}
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmReport}
                isLoading={isSubmittingReport}
                disabled={isSubmittingReport}
                className="flex-1"
              >
                {isHydrated ? t.reportConfirm : "Confirm report"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}