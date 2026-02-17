"use client";

import React from "react";

export default function HeroSideDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* 1. Left Side: Floating Memory Shards / Scrolls */}
      <div className="absolute top-[15%] left-[2%] md:left-[5%] w-32 flex flex-col gap-6 opacity-80 decoration-left">
        {/* Shard 1 */}
        <div
          className="w-8 h-24 bg-white/40 backdrop-blur-sm border-l-2 border-sakura-pink relative animate-float-slow"
          style={{ animationDelay: "0s" }}
        >
          <div className="absolute top-2 left-1 w-full h-[1px] bg-sakura-pink/30"></div>
          <div className="writing-vertical-rl text-[0.6rem] text-ink-black/60 font-jp-serif p-1 h-full tracking-widest flex items-center justify-center">
            追憶
          </div>
          <div className="absolute bottom-2 left-1 w-full h-[1px] bg-sakura-pink/30"></div>
        </div>
        {/* Shard 2 - Offset */}
        <div
          className="w-6 h-16 bg-white/30 backdrop-blur-sm border-l border-indigo-dye/30 relative ml-8 animate-float-slower"
          style={{ animationDelay: "1.5s" }}
        >
          <div className="writing-vertical-rl text-[0.5rem] text-ink-black/50 font-zen p-1 h-full tracking-wider flex items-center justify-center">
            断片
          </div>
        </div>
        {/* Shard 3 */}
        <div
          className="w-10 h-32 bg-white/50 backdrop-blur-md border-l-2 border-seal-red/40 relative -ml-2 animate-float-slow"
          style={{ animationDelay: "3s" }}
        >
          <div className="writing-vertical-rl text-[0.6rem] text-ink-black/70 font-jp-serif p-1 h-full tracking-widest flex items-center justify-center">
            記憶の庭
          </div>
        </div>
      </div>

      {/* 2. Right Side: Hanging Furin (Wind Chime) */}
      <div className="absolute top-0 right-[5%] md:right-[10%] w-20 h-64 origin-top animate-sway-gentle decoration-right">
        {/* String */}
        <div className="w-[1px] h-20 bg-stone-400 mx-auto"></div>

        {/* Bell Body (Glass) */}
        <div className="w-12 h-10 mx-auto rounded-t-full rounded-b-lg bg-gradient-to-br from-white/40 to-blue-100/20 backdrop-blur-sm border border-white/60 relative overflow-hidden shadow-sm">
          {/* Internal detail */}
          <div className="absolute top-1 left-3 w-3 h-3 rounded-full bg-white/80 blur-[1px]"></div>
        </div>

        {/* String inside hanging down */}
        <div className="w-[1px] h-8 bg-stone-300 mx-auto"></div>

        {/* Tanzaku (Paper Strip) */}
        <div className="w-8 h-24 bg-[#fffcf7] mx-auto border border-stone-100 shadow-sm flex items-center justify-center animate-flutter origin-top">
          <span className="writing-vertical-rl text-xs font-zen text-seal-red/70 tracking-widest py-2 select-none">
            永劫回帰
          </span>
        </div>
      </div>

      <style jsx>{`
        .animate-float-slow {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float 8s ease-in-out infinite;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-sway-gentle {
          animation: sway 8s ease-in-out infinite;
        }
        @keyframes sway {
          0%,
          100% {
            transform: rotate(-2deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }

        .animate-flutter {
          animation: flutter 4s ease-in-out infinite;
        }
        @keyframes flutter {
          0%,
          100% {
            transform: rotateY(0deg) skewX(0deg);
          }
          25% {
            transform: rotateY(15deg) skewX(2deg);
          }
          75% {
            transform: rotateY(-10deg) skewX(-2deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float-slow,
          .animate-float-slower,
          .animate-sway-gentle,
          .animate-flutter {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
