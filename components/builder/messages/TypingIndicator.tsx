'use client';

import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl rounded-bl-none max-w-[100px]">
      <div className="flex gap-1">
        <motion.span
          className="w-2 h-2 bg-white rounded-full"
          animate={{
            y: [0, -8, 0],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0,
          }}
        />
        <motion.span
          className="w-2 h-2 bg-white rounded-full"
          animate={{
            y: [0, -8, 0],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />
        <motion.span
          className="w-2 h-2 bg-white rounded-full"
          animate={{
            y: [0, -8, 0],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
        />
      </div>
    </div>
  );
}

