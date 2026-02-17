"use client";

import React, { useEffect, useState } from "react";
import styles from "./Loader.module.css";

const LOADER_DURATION_MS = 3200;

export default function LoaderLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(6);

  useEffect(() => {
    // Progress animation so loader feels intentional and complete.
    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.min(94, prev + Math.random() * 7));
    }, 120);

    // Close loader after delay
    const timer = setTimeout(() => {
      setProgress(100);
      setIsLoading(false);
    }, LOADER_DURATION_MS);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, []);


  return (
    <>
      <div className={`${styles.loaderTop} ${isLoading ? "" : styles.closing}`} />

      <div
        className={`${styles.loaderBottom} ${isLoading ? "" : styles.closing}`}
      />

      <div
        className={`${styles.loaderContent} ${isLoading ? "" : styles.closing}`}
      >
        <div className={styles.subtitle}>Connection • Bond</div>
        <div className={styles.spinner} />

        <div className={styles.title}>Entering Kizuna</div>
        <div className={styles.status}>Preserving memories...</div>

        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {children}
    </>
  );
}
