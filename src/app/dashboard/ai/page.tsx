"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Bot, Send, User, Plus, Search, MessageSquare, Trash2 } from "lucide-react";
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
  // State untuk daftar obrolan terbaru
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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sync pesan aktif ketika berpindah obrolan
  const handleSelectChat = (chat: ChatHistory) => {
    setActiveChatId(chat.id);
    setMessages(chat.messages);
  };

  // Mulai percakapan baru
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
  };

  // Hapus obrolan dari riwayat
  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    if (activeChatId === id && updated.length > 0) {
      setActiveChatId(updated[0].id);
      setMessages(updated[0].messages);
    }
  };

  // Filter obrolan berdasarkan pencarian
  const filteredHistory = history.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const next = [...messages, { role: "user" as const, text: userText }];
    setMessages(next);
    setInput("");
    setLoading(true);

    // Update judul obrolan jika masih "Obrolan Baru"
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
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-6xl gap-4 p-2">
      
      {/* PANEL KIRI: PERCAKAPAN BARU, TELUSURI, & OBROLAN TERBARU */}
      <div className="flex w-72 shrink-0 flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        
        {/* Tombol Percakapan Baru */}
        <Button
          onClick={handleNewChat}
          className="flex w-full items-center justify-start gap-2.5 rounded-xl bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-purple-700"
        >
          <Plus className="h-4 w-4" />
          Percakapan Baru
        </Button>

        {/* Input Telusuri Percakapan */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Telusuri percakapan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-700 placeholder-slate-400 outline-none transition-all focus:border-purple-300 focus:bg-white focus:ring-2 focus:ring-purple-100"
          />
        </div>

        {/* Label Obrolan Terbaru */}
        <div className="px-1 pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Obrolan Terbaru
          </span>
        </div>

        {/* Daftar Riwayat Obrolan */}
        <div className="flex-1 space-y-1 overflow-y-auto pr-1">
          {filteredHistory.length === 0 ? (
            <p className="py-4 text-center text-xs text-slate-400">Tidak ada obrolan.</p>
          ) : (
            filteredHistory.map((item) => {
              const isActive = item.id === activeChatId;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectChat(item)}
                  className={`group relative flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-all ${
                    isActive
                      ? "bg-purple-50 text-purple-700 font-medium"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <MessageSquare className={`h-4 w-4 shrink-0 ${isActive ? "text-purple-600" : "text-slate-400"}`} />
                    <span className="truncate text-xs">{item.title}</span>
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

      {/* PANEL KANAN: AREA CHAT UTAMA */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="mb-3">
          <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <Bot className="h-5 w-5 text-purple-600" /> Kawan MindMe
          </h1>
          <p className="text-xs text-slate-500">
            Ditenagai Google Cloud AI · Bukan pengganti profesional medis.
          </p>
        </div>

        <Card className="flex flex-1 flex-col overflow-hidden border-slate-200/80 p-0 shadow-sm">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
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
                      m.role === "user" ? "bg-slate-800" : "bg-purple-600"
                    } text-white`}
                  >
                    {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Bot className="h-4 w-4 animate-pulse text-purple-600" /> Kawan MindMe sedang mengetik...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-end gap-2 border-t border-slate-100 p-3 bg-white"
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
              className="min-h-[42px] flex-1 resize-none rounded-xl border-slate-200 text-xs focus-visible:ring-purple-200"
              rows={1}
            />
            <Button type="submit" size="icon" disabled={loading} className="rounded-xl bg-purple-600 hover:bg-purple-700">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}