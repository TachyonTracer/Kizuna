"use client";

import React from "react";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-b from-transparent via-[#fff5f7] to-[#f9f0ec] opacity-60">
      {/* 1. Asanoha Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='30' viewBox='0 0 60 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232b2825' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v8h2v-8h4v-2h-4zm0-30V0h-2v4h-4v2h4v8h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v8h2v-8h4v-2H6zM6 4V0H4v4H0v2h4v8h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* 2. Large Faint Kanji Watermarks */}
      <div className="absolute top-[10%] left-[5%] text-[20rem] font-zen opacity-[0.08] text-ink-black select-none leading-none rotate-12">
        絆
      </div>
      <div className="absolute bottom-[10%] right-[5%] text-[15rem] font-zen opacity-[0.08] text-seal-red select-none leading-none -rotate-6">
        縁
      </div>

      {/* 3. Decorative Circles/Enso-like elements */}
      <svg className="absolute top-1/4 left-1/4 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 opacity-[0.15] animate-spin-slow">
        <circle
          cx="250"
          cy="250"
          r="200"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="10 20"
          className="text-indigo-dye"
        />
        <circle
          cx="250"
          cy="250"
          r="150"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-seal-red"
        />
      </svg>

      {/* 4. Drifting "Red Thread" Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-100">
        <path
          d="M-100,200 Q 300,500 600,100 T 1200,600"
          fill="none"
          stroke="#b33030"
          strokeWidth="1.5"
          strokeOpacity="0.4"
          className="animate-thread-float"
        />
        <path
          d="M-100,600 Q 400,200 900,500 T 1500,100"
          fill="none"
          stroke="#d68e9d"
          strokeWidth="2.5"
          strokeOpacity="0.3"
        />
      </svg>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 60s linear infinite;
        }
        @keyframes spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
