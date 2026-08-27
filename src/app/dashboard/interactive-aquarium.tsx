"use client";

import { useEffect, useState } from "react";

type MoodExpression = "senang" | "netral" | "sedih";

export function InteractiveAquarium({
  totalMoods,
  lastMoodExpression,
}: {
  totalMoods: number;
  /** Ekspresi wajah air berdasarkan mood terakhir yang ditambahkan user */
  lastMoodExpression?: MoodExpression;
}) {
  const [prevMoods, setPrevMoods] = useState(totalMoods);
  const [isDropping, setIsDropping] = useState(false);
  const [displayLevel, setDisplayLevel] = useState(totalMoods);
  const [blink, setBlink] = useState(false);

  // Menangani masalah Hydration agar useEffect hanya jalan setelah mount di client
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (totalMoods > prevMoods) {
      setIsDropping(true);
      
      const timer = setTimeout(() => {
        setIsDropping(false);
        setDisplayLevel(totalMoods);
      }, 600);

      setPrevMoods(totalMoods);
      return () => clearTimeout(timer);
    } else if (totalMoods !== prevMoods) {
      setDisplayLevel(totalMoods);
      setPrevMoods(totalMoods);
    }
  }, [totalMoods, prevMoods, mounted]);

  // Kedipan mata berkala biar terasa "hidup"
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3200);
    return () => clearInterval(interval);
  }, [mounted]);

  const maxKapasitas = 50; 
  const persentaseAir = Math.max(15, Math.min((displayLevel / maxKapasitas) * 100, 100));
  const expression: MoodExpression = lastMoodExpression ?? "netral";

  // Cegah render animasi sebelum komponen benar-benar dimuat di browser
  if (!mounted) return <div className="h-56 w-56" />;

  const mouthPath =
    expression === "senang"
      ? "M 7 4 Q 22 21 37 4" // senyum lebar & melengkung dalam
      : expression === "sedih"
      ? "M 8 15 Q 22 1 36 15" // cemberut melengkung ke atas
      : "M 10 8 L 34 8"; // netral, garis lurus

  return (
    <div className="group relative flex h-56 w-56 items-center justify-center drop-shadow-xl transition-transform duration-300 ease-out hover:scale-[1.04] active:scale-95">

      {/* ANIMASI TETESAN AIR JATUH */}
      {isDropping && (
        <div 
          className="absolute top-2 z-40 h-3 w-3 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]" 
          style={{ animation: 'dropWater 0.6s ease-in forwards' }} 
        />
      )}

      {/* BADAN KACA AKUARIUM — BULAT SEMPURNA */}
      <div className="relative flex h-56 w-56 items-end justify-center overflow-hidden rounded-full border-[4px] border-white/50 bg-gradient-to-b from-white/10 to-blue-50/20 shadow-[inset_0_0_25px_rgba(255,255,255,0.7)] backdrop-blur-md transition-shadow duration-300 group-hover:shadow-[inset_0_0_25px_rgba(255,255,255,0.7),0_0_0_6px_rgba(155,114,176,0.15)]">
        
        {/* AIR DI DALAM AKUARIUM */}
        <div 
          className="relative w-full bg-gradient-to-t from-blue-500/80 to-cyan-300/60 transition-all duration-1000 ease-out motion-safe:animate-[bob_4s_ease-in-out_infinite]"
          style={{ height: `${persentaseAir}%` }}
        >
          {/* Permukaan Air (Elips tipis di atas air) */}
          <div className="absolute -top-2 left-0 right-0 h-4 w-full rounded-[50%] bg-cyan-200/50" />
        </div>

        {/* WAJAH — SELALU DI TENGAH BOLA, MENGIKUTI MOOD TERAKHIR YANG DITAMBAHKAN */}
        <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-2">

          {/* PIPI MERONA — hanya saat senang, bikin ekspresi terasa lebih hidup */}
          {expression === "senang" && (
            <>
              <span className="absolute left-1/2 top-1/2 h-2.5 w-3 -translate-x-[38px] -translate-y-[10px] rounded-full bg-pink-300/70 blur-[2px]" />
              <span className="absolute left-1/2 top-1/2 h-2.5 w-3 translate-x-[26px] -translate-y-[10px] rounded-full bg-pink-300/70 blur-[2px]" />
            </>
          )}

          {/* ALIS — menambah nuansa sedih yang lebih kena */}
          {expression === "sedih" && (
            <div className="flex items-center gap-3">
              <span className="block h-[2.5px] w-4 -rotate-[18deg] translate-y-[3px] rounded-full bg-ink/60" />
              <span className="block h-[2.5px] w-4 rotate-[18deg] translate-y-[3px] rounded-full bg-ink/60" />
            </div>
          )}

          {/* MATA */}
          <div className="flex items-center gap-4">
            {expression === "senang" ? (
              <>
                {/* Mata senang berbentuk lengkung "^" — kesan mata tersenyum */}
                <svg width="14" height="9" viewBox="0 0 14 9" fill="none" className={`transition-transform duration-150 ${blink ? "scale-y-[0.2]" : "scale-y-100"}`}>
                  <path d="M1 8 Q7 -1 13 8" stroke="#1e293b" strokeWidth="2.3" strokeLinecap="round" fill="none" />
                </svg>
                <svg width="14" height="9" viewBox="0 0 14 9" fill="none" className={`transition-transform duration-150 ${blink ? "scale-y-[0.2]" : "scale-y-100"}`}>
                  <path d="M1 8 Q7 -1 13 8" stroke="#1e293b" strokeWidth="2.3" strokeLinecap="round" fill="none" />
                </svg>
              </>
            ) : (
              <>
                <span className={`relative block h-3 w-3 rounded-full bg-ink transition-transform duration-150 ${blink ? "scale-y-[0.1]" : "scale-y-100"}`}>
                  <span className="absolute left-[2.5px] top-[1.5px] h-1 w-1 rounded-full bg-white/85" />
                </span>
                <span className={`relative block h-3 w-3 rounded-full bg-ink transition-transform duration-150 ${blink ? "scale-y-[0.1]" : "scale-y-100"}`}>
                  <span className="absolute left-[2.5px] top-[1.5px] h-1 w-1 rounded-full bg-white/85" />
                </span>
              </>
            )}
          </div>

          {/* MULUT */}
          <svg width="44" height="20" viewBox="0 0 44 20" fill="none">
            <path
              d={mouthPath}
              stroke="#1e293b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={expression === "senang" ? "#1e293b" : "none"}
              fillOpacity={expression === "senang" ? 0.08 : 0}
            />
          </svg>
        </div>

        {/* EFEK PANTULAN CAHAYA DI KACA */}
        <div className="pointer-events-none absolute left-4 top-8 z-20 h-24 w-6 rounded-[50%] bg-white/40 blur-md rotate-12" />
        <div className="pointer-events-none absolute right-6 top-14 z-20 h-12 w-4 rounded-[50%] bg-white/30 blur-sm -rotate-12" />
      </div>

      {/* TOOLTIP KECIL SAAT DI-HOVER: AJAKAN UNTUK MENAMBAH MOOD */}
      <div className="pointer-events-none absolute bottom-2 z-30 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-medium text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
        {lastMoodExpression ? "Mood terakhirmu · klik untuk isi lagi" : "Klik untuk isi mood pertamamu"}
      </div>

      <style>{`
        @keyframes bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}