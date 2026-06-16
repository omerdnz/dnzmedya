'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QUICK_QUESTIONS,
  WELCOME_MESSAGE,
  type ChatMessage,
} from '@/lib/chat-assistant';

function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = '';

  lines.forEach((line, lineIdx) => {
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
        codeLines = [];
      } else {
        inCodeBlock = false;
        elements.push(
          <pre
            key={`code-${lineIdx}`}
            className="my-2 overflow-x-auto rounded-lg bg-brand-black/60 p-3 text-xs leading-relaxed"
          >
            <code>{codeLines.join('\n')}</code>
          </pre>,
        );
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    elements.push(
      <span key={`line-${lineIdx}`}>
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={j} className="font-semibold text-brand-gold">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code key={j} className="rounded bg-brand-black/40 px-1 py-0.5 text-xs text-brand-cyan">
                {part.slice(1, -1)}
              </code>
            );
          }
          return <span key={j}>{part}</span>;
        })}
        {lineIdx < lines.length - 1 && <br />}
      </span>,
    );
  });

  if (inCodeBlock && codeLines.length) {
    elements.push(
      <pre key="code-final" className="my-2 overflow-x-auto rounded-lg bg-brand-black/60 p-3 text-xs">
        <code>{codeLines.join('\n')}</code>
      </pre>,
    );
  }

  return elements;
}

function createMessage(role: 'user' | 'assistant', content: string): ChatMessage {
  return { id: crypto.randomUUID(), role, content, timestamp: new Date() };
}

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage('assistant', WELCOME_MESSAGE),
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, typing]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    setError(null);
    const userMsg = createMessage('user', trimmed);

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '', timestamp: new Date() }]);

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const priorMessages = messages.slice(1);
      const apiMessages = [
        ...priorMessages
          .filter((m) => m.content)
          .map((m) => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: trimmed },
      ];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(errData.error || `Hata: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Yanıt okunamadı');

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m)),
        );
      }

      if (!fullText.trim()) {
        throw new Error('Boş yanıt alındı');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;

      const errMsg = err instanceof Error ? err.message : 'Bir hata oluştu';
      setError(errMsg);
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== assistantId);
        const last = filtered[filtered.length - 1];
        if (last?.role === 'user' && last.content === trimmed) {
          return filtered.slice(0, -1);
        }
        return filtered;
      });
    } finally {
      setTyping(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function clearChat() {
    abortRef.current?.abort();
    setMessages([createMessage('assistant', WELCOME_MESSAGE)]);
    setError(null);
    setTyping(false);
  }

  const showQuickQuestions = messages.length === 1 && !typing;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-5 z-[60] flex w-[calc(100vw-2.5rem)] max-w-[420px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-brand-elevated/95 shadow-3d backdrop-blur-2xl sm:right-6"
            style={{ maxHeight: 'min(600px, calc(100vh - 7rem))' }}
          >
            <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-brand-cyan/10 via-brand-gold/5 to-transparent px-4 py-3.5">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-cyan/30 to-brand-gold/20">
                <svg className="h-5 w-5 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-brand-elevated bg-emerald-400 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-sm font-bold text-brand-white">DNZ Asistan</p>
                <p className="text-[11px] text-brand-gray-400">Groq • Llama 3.1 • Ücretsiz</p>
              </div>
              <button
                type="button"
                onClick={clearChat}
                className="rounded-lg p-1.5 text-brand-gray-500 transition-colors hover:bg-white/10 hover:text-brand-gray-300"
                title="Sohbeti temizle"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-brand-gray-400 transition-colors hover:bg-white/10 hover:text-brand-white"
                aria-label="Kapat"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-br-md border border-brand-gold/20 bg-brand-gold/20 text-brand-white'
                        : 'rounded-bl-md border border-white/10 bg-white/[0.05] text-brand-gray-300'
                    }`}
                  >
                    {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
                  </div>
                </motion.div>
              ))}

              {typing && messages[messages.length - 1]?.content === '' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        className="h-1.5 w-1.5 rounded-full bg-brand-cyan"
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                  {error}
                </div>
              )}

              {showQuickQuestions && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => sendMessage(q)}
                      className="rounded-full border border-brand-cyan/20 bg-brand-cyan/5 px-3 py-1.5 text-xs text-brand-cyan transition-colors hover:bg-brand-cyan/15"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-white/10 p-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-brand-black/40 px-3 py-1.5 focus-within:border-brand-cyan/40">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Herhangi bir şey sorun..."
                  maxLength={4000}
                  disabled={typing}
                  className="flex-1 bg-transparent py-2 text-sm text-brand-white placeholder:text-brand-gray-500 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-cyan/20 text-brand-cyan transition-all hover:bg-brand-cyan/30 disabled:opacity-40"
                  aria-label="Gönder"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-cyan to-brand-cyan-light text-brand-black shadow-glow-cyan sm:right-6"
        aria-label={open ? 'Sohbeti kapat' : 'DNZ Asistan'}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          ) : (
            <motion.svg key="chat" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </motion.svg>
          )}
        </AnimatePresence>
        {!open && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-[10px] font-bold text-brand-black">
            AI
          </motion.span>
        )}
      </motion.button>
    </>
  );
}
