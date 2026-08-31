"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Bot, Send, User, Plus, Search, MessageSquare, Trash2, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

type Message = { role: "user" | "model"; text: string };

type ChatHistory = {
  id: string;
  title: string;
  date: string;
  messages: Message[];
};

const INITIAL_MESSAGE: Message = {
  role: "model",
  text: "Hai, aku Kawan MindMe. Aku di sini untuk mendengarkan. Ada yang ingin kamu ceritakan hari ini?",
};

export default function AiChatPage() {
  const [history, setHistory] = useState<ChatHistory[]>([
    {
      id: "1",
      title: "Menghadapi Kecemasan",
      date: "Hari ini",
      messages: [
        INITIAL_MESSAGE,
        { role: "user", text: "Aku merasa cemas dengan ujian besok." },
        { role: "model", text: "Tarik napas dalam-dalam. Wajar merasa tegang, cobalah teknik pernapasan 4-7-8 untuk meredakannya." },
      ],
    },
    {
      id: "2",
      title: "Tips Mengatasi Burnout",
      date: "Kemarin",
      messages: [
        INITIAL_MESSAGE,
        { role: "user", text: "Bagaimana cara mengatasi lelah mental karena kerjaan?" },
      ],
    },
    {
      id: "3",
      title: "Pola Tidur Sehat",
      date: "3 hari lalu",
      messages: [
        INITIAL_MESSAGE,
        { role: "user", text: "Aku susah tidur beberapa hari terakhir." },
      ],
    },
  ]);

  const [activeChatId, setActiveChatId] = useState<string>("1");
  const [messages, setMessages] = useState<Message[]>(history[0].messages);
  const [searchQuery, setSearchQuery] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // State untuk Minimize / Maximize Panel Kanan
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectChat = (chat: ChatHistory) => {
    setActiveChatId(chat.id);
    setMessages(chat.messages);
    
    // Opsional: Kalau lo versi mobile, pas chat diklik, panel otomatis nutup.
    // Tapi karena ini buat dashboard desktop, kita biarin tetap buka.
  };

  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newChat: ChatHistory = {
      id: newId,
      title: "Obrolan Baru",
      date: "Baru saja",
      messages: [INITIAL_MESSAGE],
    };
    setHistory([newChat, ...history]);
    setActiveChatId(newId);
    setMessages([INITIAL_MESSAGE]);
    // Otomatis buka panel jika sedang tertutup saat bikin chat baru
    if (!isSidebarOpen) setIsSidebarOpen(true);
  };

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    if (activeChatId === id && updated.length > 0) {
      setActiveChatId(updated[0].id);
      setMessages(updated[0].messages);
    } else if (updated.length === 0) {
      handleNewChat();
    }
  };

  // 🚀 FITUR TELUSURI DI-UPGRADE DI SINI
  const filteredHistory = history.filter((item) => {
    const query = searchQuery.toLowerCase();
    
    // 1. Cek apakah kata pencarian ada di Judul Obrolan
    const matchTitle = item.title.toLowerCase().includes(query);
    
    // 2. Cek apakah kata pencarian ada di isi pesan (User atau AI)
    const matchMessages = item.messages.some((m) => 
      m.text.toLowerCase().includes(query)
    );
    
    // Tampilkan jika cocok di judul ATAU di isi pesannya
    return matchTitle || matchMessages;
  });

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const next = [...messages, { role: "user" as const, text: userText }];
    setMessages(next);
    setInput("");
    setLoading(true);

    setHistory((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          const updatedTitle =
            chat.title === "Obrolan Baru" ? userText.slice(0, 24) + "..." : chat.title;
          return { ...chat, title: updatedTitle, messages: next };
        }
        return chat;
      })
    );

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mendapat respons AI.");

      const updatedMessages = [...next, { role: "model" as const, text: data.reply }];
      setMessages(updatedMessages);

      setHistory((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId ? { ...chat, messages: updatedMessages } : chat
        )
      );
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] w-full p-4 overflow-hidden">
      
      {/* ==================== PANEL KIRI (Area Chat Utama) ==================== */}
      <Card className="flex flex-1 flex-col overflow-hidden p-0 rounded-lg border-slate-200 shadow-sm bg-white transition-all duration-300">
        
        {/* Header Area Chat dengan Tombol Toggle Panel */}
        <div className="border-b border-slate-100 p-5 bg-white z-10 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold text-ink">
              <Bot className="h-6 w-6 text-primary" /> Kawan MindMe
            </h1>
            <p className="text-sm text-ink-muted mt-1">
              Ditenagai Google Cloud AI · Bukan pengganti profesional medis.
            </p>
          </div>

          {/* Tombol Toggle Minimize/Maximize */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary"
            title={isSidebarOpen ? "Sembunyikan Riwayat" : "Tampilkan Riwayat"}
          >
            {isSidebarOpen ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Bubble Chat Area */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6 bg-slate-50/50">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    m.role === "user" ? "bg-secondary" : "bg-primary"
                  } text-white shadow-sm`}
                >
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={`max-w-[75%] rounded-xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-primary text-white"
                      : "bg-primary-bg text-ink"
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <Bot className="h-4 w-4 animate-pulse text-primary" /> Kawan MindMe sedang mengetik...
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Chat Area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-end gap-2 border-t border-slate-200 p-4 bg-white"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ceritakan apa yang kamu rasakan..."
            className="min-h-[44px] flex-1 resize-none rounded-lg border-slate-300 text-sm focus-visible:ring-primary focus-visible:border-primary"
            rows={1}
          />
          <Button type="submit" size="icon" disabled={loading} className="bg-primary hover:opacity-90 rounded-lg">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>

      {/* ==================== PANEL KANAN (Bisa Di-Minimize) ==================== */}
      <div
        className={`transition-all duration-300 ease-in-out shrink-0 ${
          isSidebarOpen ? "w-72 ml-6 opacity-100" : "w-0 ml-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex w-72 flex-col h-full gap-4">
          
          <Button
            onClick={handleNewChat}
            className="flex w-full items-center justify-start gap-2 bg-primary text-white hover:opacity-90 shadow-sm rounded-lg"
          >
            <Plus className="h-4 w-4" />
            Percakapan Baru
          </Button>

          {/* ================= INPUT TELUSURI PERCAKAPAN ================= */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Telusuri percakapan"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-ink outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>

          <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Obrolan Terbaru
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <Search className="h-8 w-8 text-slate-200 mb-2" />
                  <p className="text-sm text-ink-muted">Tidak ada percakapan yang cocok.</p>
                </div>
              ) : (
                filteredHistory.map((item) => {
                  const isActive = item.id === activeChatId;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectChat(item)}
                      className={`group relative flex cursor-pointer items-center justify-between rounded-md px-3 py-2 transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-ink hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <MessageSquare className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-slate-400"}`} />
                        <span className="truncate text-sm">{item.title}</span>
                      </div>

                      <button
                        onClick={(e) => handleDeleteChat(e, item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                        title="Hapus obrolan"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}