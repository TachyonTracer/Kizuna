"use client";

import { useEffect, useState } from "react";

const PETAL_IMAGE = "/petals/petal.svg";

interface Petal {
  id: number;
  left: string;
  animationDuration: string;
  animationDelay: string;
  width: string;
}

export default function FallingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Generate petals only on client-side to avoid hydration mismatch
    const newPetals = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 5 + 8}s`, // 8-13s (slower fall)
      animationDelay: `-${Math.random() * 13}s`, // Start mid-animation
      width: `${Math.random() * 15 + 10}px`, // 10-25px (varied sizes)
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {petals.map((petal) => (
        <img
          key={petal.id}
          src={PETAL_IMAGE}
          alt=""
          className="absolute animate-fall"
          loading="eager"
          decoding="async"
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
