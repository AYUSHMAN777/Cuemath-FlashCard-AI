"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type FlipFlashcardProps = {
  question: string;
  answer: string;
  flipped?: boolean;
  onToggle?: () => void;
};

export default function FlipFlashcard({
  question,
  answer,
  flipped,
  onToggle,
}: FlipFlashcardProps) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const isControlled = typeof flipped === "boolean";
  const isFlipped = isControlled ? flipped : internalFlipped;

  const toggle = () => {
    onToggle?.();
    if (!isControlled) setInternalFlipped((v) => !v);
  };

  return (
    <div className="mx-auto w-full max-w-2xl [perspective:1600px]">
      <motion.div
        onClick={toggle}
        className="relative h-[20rem] w-full cursor-pointer sm:h-[20rem] lg:h-[20rem]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        whileTap={{ scale: 0.995 }}
      >
        <div className="absolute inset-0 flex items-center justify-center rounded-3xl border border-black/10 bg-white/80 p-5 text-center text-lg font-semibold leading-relaxed text-zinc-900 shadow-sm backdrop-blur [backface-visibility:hidden] dark:border-white/10 dark:bg-black/50 dark:text-white sm:p-7 sm:text-xl lg:p-8 lg:text-2xl">
          {question}
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center rounded-3xl border border-sky-300/40 bg-gradient-to-br from-sky-500 to-violet-600 p-5 text-center text-base font-medium leading-relaxed text-white shadow-md [backface-visibility:hidden] sm:p-7 sm:text-lg lg:p-8 lg:text-xl"
          style={{ transform: "rotateY(180deg)" }}
        >
          {answer}
        </div>
      </motion.div>
    </div>
  );
}

