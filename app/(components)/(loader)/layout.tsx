"use client";

import React, { useEffect, useState } from "react";
import styles from "./Loader.module.css";

const PETAL_IMAGE = "/petals/petal.svg";
const PETAL_COUNT = 25;

export default function LoaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [petals, setPetals] = useState<
    { id: number; style: React.CSSProperties }[]
  >([]);

  useEffect(() => {
    setIsMounted(true);

    // Generate random petals (do not set `top` — let the CSS animation control vertical position)
    const newPetals = Array.from({ length: PETAL_COUNT }).map((_, i) => ({
      id: i,
      style: {
        width: `${Math.random() * 15 + 10}px`,
        height: `${Math.random() * 15 + 10}px`,
        left: `${Math.random() * 100}%`,
        animationDelay: `-${Math.random() * 13}s`, // start mid-animation to avoid initial jump
        animationDuration: `${Math.random() * 5 + 8}s`, // 8-13s to match FallingPetals
        opacity: Math.random() * 0.5 + 0.4,
      },
    }));
    setPetals(newPetals);

    // Close loader after delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* Loader Overlay */}
      <div
        className={`${styles.loaderTop} ${!isLoading ? styles.closing : ""}`}
      >
        <div className={styles.sakuraBg}>
          {petals.map((petal) => (
            <img
              key={`top-${petal.id}`}
              src={PETAL_IMAGE}
              className={`${styles.sakura} animate-fall`}
              loading="eager"
              decoding="async"
              style={petal.style}
              alt=""
            />
          ))}
        </div>
      </div>

      <div
        className={`${styles.loaderBottom} ${!isLoading ? styles.closing : ""}`}
      >
        <div className={styles.sakuraBg}>
          {petals.map((petal) => (
            <img
              key={`bottom-${petal.id}`}
              src={PETAL_IMAGE}
              className={`${styles.sakura} animate-fall`}
              loading="eager"
              decoding="async"
              style={{
                ...petal.style,
                // Vary positions slightly for bottom to look different
                left: `${(parseFloat(petal.style.left as string) + 50) % 100}%`,
              }}
              alt=""
            />
          ))}
        </div>
      </div>

      <div
        className={`${styles.loaderContent} ${!isLoading ? styles.closing : ""}`}
      >
        <div className={styles.subtitle}>Connection • Bond</div>

        <div className={styles.spinner}>
          <svg viewBox="0 0 100 100" className={styles.spinnerSvg}>
            <defs>
              <linearGradient
                id="threadGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#b33030" stopOpacity="0" />
                <stop offset="50%" stopColor="#b33030" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#d4697f" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Background delicate ring */}
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#e6dccd"
              strokeWidth="0.5"
              className={styles.staticRing}
            />

            {/* The Red Thread - "Kizuna" Bond */}
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="url(#threadGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              className={styles.threadPath}
            />

            {/* Inner dashed ring */}
            <circle
              cx="50"
              cy="50"
              r="32"
              fill="none"
              stroke="#d68e9d"
              strokeWidth="1"
              strokeDasharray="4 6"
              className={styles.innerRing}
            />

            {/* Center Petal Icon instead of dot */}
            <image
              href="/petals/petal.svg"
              x="35"
              y="35"
              height="30"
              width="30"
              className={styles.centerIcon}
            />
          </svg>
        </div>

        <div className={styles.bottomText}>
          <div className={styles.title}>Entering Kizuna</div>
          <div className={styles.status}>Preserving memories...</div>

          <div className={styles.dots}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        </div>
      </div>

      {children}
    </>
  );
}
