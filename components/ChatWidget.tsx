"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const CALENDLY_URL = "https://calendly.com/flowrate/30min";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING =
  "Hi, I'm Flowrate's AI assistant. Ask me about the systems we build, how a project works, or how to get started.";

/* Turn URLs and email addresses in a reply into real links that wrap inside the bubble. */
const LINK_RE = /(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+\.[\w.]+)/g;
const BOOKING = "calendly.com/flowrate";
const TEASER_KEY = "flowrate-chat-teaser";
const TEASER_IN_MS = 14000;
const TEASER_FOR_MS = 8000;

function Rich({ text, dark = false }: { text: string; dark?: boolean }) {
  const parts = text.split(LINK_RE);
  const linkCls = dark ? "text-white underline underline-offset-2" : "text-heading font-semibold underline underline-offset-2 decoration-line-strong hover:decoration-heading";
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return <span key={i}>{part}</span>;
        const trail = part.match(/[.,!?;:)]+$/)?.[0] ?? "";
        const core = trail ? part.slice(0, -trail.length) : part;
        const isMail = !core.startsWith("http");
        const href = isMail ? `mailto:${core}` : core;
        const label = isMail ? core : core.replace(/^https?:\/\//, "").replace(/\/$/, "");
        return (
          <span key={i}>
            <a href={href} {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })} className={`${linkCls} [overflow-wrap:anywhere]`}>
              {label}
            </a>
            {trail}
          </span>
        );
      })}
    </>
  );
}

function Avatar({ size = "w-7 h-7" }: { size?: string }) {
  return (
    <div className={`${size} relative rounded-[7px] overflow-hidden bg-canvas border border-line flex-shrink-0`}>
      <Image src="/mascot.png" alt="" fill sizes="28px" className="object-cover object-top scale-[1.35] origin-top" />
    </div>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Teaser: once per session, 14s in (after the hero has played), gone again 8s later.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(TEASER_KEY)) return;
    } catch {
      /* storage blocked: fall through and show it this once */
    }
    const show = setTimeout(() => {
      setShowBubble(true);
      try { sessionStorage.setItem(TEASER_KEY, "1"); } catch { /* ignore */ }
    }, TEASER_IN_MS);
    const hide = setTimeout(() => setShowBubble(false), TEASER_IN_MS + TEASER_FOR_MS);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  // Keep the latest message in view
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking, open]);

  async function handleSend() {
    const text = input.trim();
    if (!text || thinking) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setThinking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      const reply: string =
        typeof data.reply === "string" && data.reply.trim()
          ? data.reply
          : "The chat is having trouble right now. You can reach Andrew directly at andrew@flowrate.agency.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "The chat is having trouble right now. You can reach Andrew directly at andrew@flowrate.agency.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[min(20rem,calc(100vw-3rem))] bg-paper border border-line rounded-lg shadow-[0_24px_48px_-12px_rgba(16,24,40,0.25)] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-carbon px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 relative rounded-[8px] overflow-hidden border border-white/20 bg-white/10 flex-shrink-0">
                  <Image src="/mascot.png" alt="" fill sizes="36px" className="object-cover object-top scale-[1.35] origin-top" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">Flowrate assistant</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                                        <p className="text-white/60 text-xs font-medium">Answers instantly</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 text-white">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Messages area */}
            <div ref={scrollRef} className="px-4 py-4 space-y-3 h-80 overflow-y-auto bg-soft">
              {messages.map((m, i) =>
                m.role === "assistant" ? (
                  <div key={i} className="flex items-start gap-2.5">
                    <Avatar />
                    <div className="bg-paper border border-line rounded-lg rounded-tl-sm px-4 py-3 max-w-[248px] min-w-0">
                      <p className="text-heading text-sm leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]"><Rich text={m.content} /></p>
                      {m.content.includes(BOOKING) && (
                        <a
                          href={CALENDLY_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-green text-[#0C1A0D] text-[12px] font-bold uppercase tracking-[0.025em] px-3 py-2.5 hover:bg-green-light transition-colors"
                        >
                          Book a free call
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-end">
                    <div className="bg-carbon rounded-lg rounded-tr-sm px-4 py-3 max-w-[248px]">
                      <p className="text-white text-sm font-medium whitespace-pre-wrap [overflow-wrap:anywhere]"><Rich text={m.content} dark /></p>
                    </div>
                  </div>
                ),
              )}

              {thinking && (
                <div className="flex items-start gap-2.5">
                  <Avatar />
                  <div className="bg-paper border border-line rounded-lg rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ opacity: [0.25, 1, 0.25] }}
                          transition={{ repeat: Infinity, duration: 1.1, delay: i * 0.18 }}
                          className="w-3 h-[3px] rounded-[2px] bg-faint"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 pb-4 pt-3 border-t border-line">
              <div className="flex items-center gap-2 bg-paper border border-line-strong rounded-lg px-4 py-2.5 focus-within:border-heading transition-colors">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about systems, process, cost..."
                  className="flex-1 bg-transparent text-heading text-[16px] sm:text-sm placeholder:text-faint outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || thinking}
                  className="w-7 h-7 rounded-lg bg-green disabled:bg-soft disabled:border disabled:border-line-strong disabled:*:text-faint flex items-center justify-center transition-colors cursor-pointer disabled:cursor-default flex-shrink-0"
                  aria-label="Send"
                >
                  <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 text-[#060C07]">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <p className="text-muted text-[11px] text-center mt-2">
                AI assistant. For anything it can&apos;t answer, Andrew follows up personally.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teaser bubble */}
      <AnimatePresence>
        {showBubble && !open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={() => { setOpen(true); setShowBubble(false); }}
            className="relative max-sm:hidden bg-paper border border-line rounded-lg pl-4 pr-8 py-3 shadow-[0_12px_32px_-8px_rgba(16,24,40,0.2)] cursor-pointer hover:border-line-strong transition-colors max-w-[230px]"
          >
            <div className="flex items-start gap-2.5">
              <Avatar />
              <div>
                <p className="text-heading text-xs leading-relaxed">
                  Wondering if your process could be a system? Ask our AI assistant.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowBubble(false); }}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-[6px] flex items-center justify-center text-muted hover:text-heading hover:bg-canvas transition-colors cursor-pointer"
              aria-label="Dismiss"
            >
              <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
                <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger bubble button */}
      <button
        onClick={() => { setOpen(!open); setShowBubble(false); }}
        className="fr-pop-in w-14 h-14 rounded-[16px] bg-green shadow-[0_8px_24px_-6px_rgba(16,24,40,0.3)] flex items-center justify-center cursor-pointer hover:bg-green-light transition-colors relative"
        aria-label="Chat with the Flowrate AI assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              viewBox="0 0 18 18" fill="none" className="w-5 h-5 text-[#060C07]"
            >
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-[#060C07]"
            >
              <path d="M17 10c0 4-3.134 7-7 7a7.116 7.116 0 01-3.46-.9L3 17l.9-3.54A6.962 6.962 0 013 10c0-3.866 3.134-7 7-7s7 3.134 7 7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>

    </div>
  );
}
