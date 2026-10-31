"use client";

import React, { useState, useEffect } from "react";

const ROTATING_WORDS = [
  { word: "Automated", color: "from-emerald-400 via-teal-300 to-emerald-200" },
  { word: "Flawless", color: "from-cyan-400 via-sky-300 to-teal-200" },
  { word: "Scalable", color: "from-amber-400 via-yellow-300 to-amber-200" },
  { word: "Transaction-Safe", color: "from-emerald-400 via-teal-300 to-cyan-300" },
];

export function KineticText() {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setIsAnimating(true);
      }, 350);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const current = ROTATING_WORDS[index];

  return (
    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto">
      Engineered for{" "}
      <span className="inline-block relative min-w-[280px] sm:min-w-[380px] text-left">
        <span
          className={`inline-block font-serif italic font-normal tracking-wide bg-gradient-to-r ${
            current.color
          } bg-clip-text text-transparent transition-all duration-300 transform ${
            isAnimating
              ? "opacity-100 translate-y-0 filter-none scale-100"
              : "opacity-0 -translate-y-4 blur-md scale-95"
          }`}
          style={{ willChange: "transform, opacity, filter" }}
        >
          {current.word}
        </span>
      </span>
      <br />
      Financial Operations.
    </h1>
  );
}
