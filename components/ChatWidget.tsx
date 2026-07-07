"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING =
  "Hey, I'm Flowrate's AI assistant. Ask me anything about websites, SEO, pricing, or how working with Andrew goes.";

function Avatar({ size = "w-7 h-7" }: { size?: string }) {
  return (
    <div className={`${size} rounded-full overflow-hidden bg-[#060C07] border border-white/10 flex-shrink-0`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/andrew.jpg" alt="Andrew from Flowrate" className="w-full h-full object-cover object-top" />
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

  // Show the teaser bubble after 3s
  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 3000);
    return () => clearTimeout(t);
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
            className="w-80 bg-[#0D1F0E] border border-white/10 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-green px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/30 bg-[#060C07] flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/andrew.jpg" alt="Andrew from Flowrate" className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <p className="text-[#060C07] font-bold text-sm leading-tight">Flowrate AI Assistant</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#060C07]/60 animate-pulse" />
                    <p className="text-[#060C07]/70 text-xs font-medium">Answers instantly</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full bg-[#060C07]/15 hover:bg-[#060C07]/25 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 text-[#060C07]">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Messages area */}
            <div ref={scrollRef} className="px-4 py-4 space-y-3 h-80 overflow-y-auto">
              {messages.map((m, i) =>
                m.role === "assistant" ? (
                  <div key={i} className="flex items-start gap-2.5">
                    <Avatar />
                    <div className="bg-white/8 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[220px]">
                      <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-end">
                    <div className="bg-green/90 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[220px]">
                      <p className="text-[#060C07] text-sm font-medium whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </div>
                ),
              )}

              {thinking && (
                <div className="flex items-start gap-2.5">
                  <Avatar />
                  <div className="bg-white/8 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ opacity: [0.25, 1, 0.25] }}
                          transition={{ repeat: Infinity, duration: 1.1, delay: i * 0.18 }}
                          className="w-1.5 h-1.5 rounded-full bg-white/60"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 bg-white/6 border border-white/10 rounded-2xl px-4 py-2.5 focus-within:border-green/40 transition-colors">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about websites, SEO, process..."
                  className="flex-1 bg-transparent text-white/80 text-sm placeholder-white/25 outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || thinking}
                  className="w-7 h-7 rounded-full bg-green disabled:bg-white/10 flex items-center justify-center transition-colors cursor-pointer disabled:cursor-default flex-shrink-0"
                  aria-label="Send"
                >
                  <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 text-[#060C07]">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <p className="text-white/20 text-[10px] text-center mt-2">
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
            className="bg-[#0D1F0E] border border-white/12 rounded-2xl px-4 py-3 shadow-xl shadow-black/40 cursor-pointer hover:border-green/30 transition-colors max-w-[220px]"
          >
            <div className="flex items-start gap-2.5">
              <Avatar />
              <div>
                <p className="text-white/80 text-xs leading-relaxed">
                  Questions about websites or SEO? Ask our AI assistant.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger bubble button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 300, damping: 20 }}
        onClick={() => { setOpen(!open); setShowBubble(false); }}
        className="w-14 h-14 rounded-full bg-green shadow-lg shadow-green/30 flex items-center justify-center cursor-pointer hover:bg-green-light transition-colors relative"
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

        {/* Notification dot */}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full border-2 border-[#060C07] animate-pulse" />
        )}
      </motion.button>

    </div>
  );
}
