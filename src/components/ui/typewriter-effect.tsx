"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TypewriterEffectProps {
  words: string[];
  className?: string;
  cursorClassName?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

type Phase = "typing" | "visible" | "fading" | "waiting";

export function TypewriterEffect({
  words,
  className,
  cursorClassName,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
}: TypewriterEffectProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");

  const tick = useCallback(() => {
    const currentWord = words[wordIndex];

    if (phase === "typing") {
      if (text.length < currentWord.length) {
        return { delay: typingSpeed, next: () => setText(currentWord.slice(0, text.length + 1)) };
      }
      // Done typing — hold visible
      return { delay: pauseDuration, next: () => setPhase("fading") };
    }

    if (phase === "fading") {
      // Wait for CSS fade-out to finish, then clear text and move to next word
      return {
        delay: 400,
        next: () => {
          setText("");
          setWordIndex((prev) => (prev + 1) % words.length);
          setPhase("waiting");
        },
      };
    }

    if (phase === "waiting") {
      // Brief pause before typing next word
      return { delay: 200, next: () => setPhase("typing") };
    }

    return { delay: 0, next: () => {} };
  }, [text, phase, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  useEffect(() => {
    const { delay, next } = tick();
    const timeout = setTimeout(next, delay);
    return () => clearTimeout(timeout);
  }, [tick]);

  return (
    <span className={cn("inline-flex items-baseline", className)}>
      <span
        className={cn(
          "inline-block transition-all duration-400 ease-out",
          phase === "fading"
            ? "translate-y-1.5 opacity-0 blur-[2px]"
            : "translate-y-0 opacity-100 blur-0"
        )}
      >
        {text}
      </span>
      <span
        className={cn(
          "ml-0.5 inline-block h-[1em] w-[3px] translate-y-[0.1em] animate-blink rounded-sm bg-neutral-900 dark:bg-white",
          cursorClassName
        )}
      />
    </span>
  );
}
