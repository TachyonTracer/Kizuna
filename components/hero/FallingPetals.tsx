"use client";

import Image from "next/image";

const PETAL_IMAGE = "/petals/petal.svg";

interface Petal {
  id: number;
  left: string;
  animationDuration: string;
  animationDelay: string;
  width: string;
}

export default function FallingPetals() {
  // Deterministic petals avoid hydration mismatch and lint issues.
  const petals: Petal[] = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${(i * 7.3) % 100}%`,
    animationDuration: `${8 + (i % 6)}s`,
    animationDelay: `-${(i * 0.8) % 13}s`,
    width: `${10 + (i % 16)}px`,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {petals.map((petal) => (
        <Image
          key={petal.id}
          src={PETAL_IMAGE}
          alt=""
          className="absolute animate-fall"
          width={24}
          height={24}
          priority
          style={{
            left: petal.left,
            width: petal.width,
            animationDuration: petal.animationDuration,
            animationDelay: petal.animationDelay,
          }}
        />
      ))}
    </div>
  );
}
