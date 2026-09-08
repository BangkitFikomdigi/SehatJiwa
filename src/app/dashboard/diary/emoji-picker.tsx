"use client";

import { useEffect, useRef, useState } from "react";
import { SmilePlus, X } from "lucide-react";

const EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
  { label: "Senang", emojis: ["😄", "😁", "😊", "🥰", "🤩", "😌", "🙌", "✨"] },
  { label: "Netral", emojis: ["😐", "🙂", "😶", "🤔", "😴", "😑", "🫠", "🙃"] },
  { label: "Sedih", emojis: ["🙁", "😢", "😞", "😔", "🥺", "😟", "😭", "💔"] },
  { label: "Marah / Stres", emojis: ["😠", "😡", "🤬", "😤", "😩", "😫", "🥵", "😰"] },
  { label: "Lainnya", emojis: ["😨", "😱", "🤒", "🤕", "🥱", "😷", "🌧️", "🌤️"] },
];

export function EmojiPickerButton({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (emoji: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
          value
            ? "border-primary-lighter bg-primary-bg text-primary"
            : "border-dashed border-gray-300 bg-white text-ink-muted hover:border-primary-lighter hover:text-primary"
        }`}
      >
        {value ? (
          <>
            <span className="text-base leading-none">{value}</span>
            Emoji dipilih
          </>
        ) : (
          <>
            <SmilePlus className="h-3.5 w-3.5" /> Tambah Emoji
          </>
        )}
      </button>

      {value && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange(null);
          }}
          aria-label="Hapus emoji"
          className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-400 text-white hover:bg-red-500"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}

      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
          <p className="mb-2 text-xs font-semibold text-ink-muted">Pilih emoji buat perasaanmu</p>
          <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
            {EMOJI_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-ink-muted/70">
                  {group.label}
                </p>
                <div className="grid grid-cols-8 gap-1">
                  {group.emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        onChange(emoji);
                        setOpen(false);
                      }}
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-base hover:bg-primary-bg ${
                        value === emoji ? "bg-primary-bg ring-1 ring-primary" : ""
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
