"use client";

import { useEffect, useState } from "react";

export function InteractiveAquarium({ totalMoods }: { totalMoods: number }) {
  const [prevMoods, setPrevMoods] = useState(totalMoods);
  const [isDropping, setIsDropping] = useState(false);
  const [displayLevel, setDisplayLevel] = useState(totalMoods);

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

  const maxKapasitas = 50; 
  const persentaseAir = Math.max(15, Math.min((displayLevel / maxKapasitas) * 100, 100));

  // Cegah render animasi sebelum komponen benar-benar dimuat di browser
  if (!mounted) return <div className="h-64 w-64" />;

  return (
    <div className="relative flex flex-col items-center justify-end h-64 w-64 drop-shadow-xl">
      
      {/* BIBIR ATAS AKUARIUM (Bentuk Elips) */}
      <div className="absolute top-4 z-30 h-6 w-32 rounded-[50%] border-4 border-white/60 bg-transparent shadow-[0_4px_10px_rgba(255,255,255,0.5)] backdrop-blur-sm" />

      {/* ANIMASI TETESAN AIR JATUH */}
      {isDropping && (
        <div 
          className="absolute top-6 z-40 h-4 w-4 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]" 
          style={{ animation: 'dropWater 0.6s ease-in forwards' }} 
        />
      )}

      {/* BADAN KACA AKUARIUM (Bentuk Toples Bulat) */}
      <div 
        className="relative mt-6 flex h-48 w-56 items-end justify-center overflow-hidden border-[4px] border-white/50 bg-gradient-to-b from-white/10 to-blue-50/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.7)] backdrop-blur-md"
        style={{ borderRadius: '45% 45% 45% 45% / 55% 55% 45% 45%' }}
      >
        
        {/* AIR DI DALAM AKUARIUM */}
        <div 
          className="relative w-full bg-gradient-to-t from-blue-500/80 to-cyan-300/60 transition-all duration-1000 ease-out"
          style={{ height: `${persentaseAir}%` }}
        >
          {/* Permukaan Air (Elips tipis di atas air) */}
          <div className="absolute -top-2 left-0 right-0 h-4 w-full rounded-[50%] bg-cyan-200/50" />
        </div>

        {/* EFEK PANTULAN CAHAYA DI KACA */}
        <div className="pointer-events-none absolute left-2 top-8 z-20 h-24 w-6 rounded-[50%] bg-white/40 blur-md rotate-12" />
        <div className="pointer-events-none absolute right-4 top-12 z-20 h-12 w-4 rounded-[50%] bg-white/30 blur-sm -rotate-12" />
      </div>
    </div>
  );
}