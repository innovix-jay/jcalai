'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface SuggestedActionsProps {
  actions: string[];
  onActionClick: (action: string) => void;
}

export function SuggestedActions({ actions, onActionClick }: SuggestedActionsProps) {
  const [clicked, setClicked] = useState<string | null>(null);

  const handleClick = (action: string) => {
    setClicked(action);
    setTimeout(() => {
      onActionClick(action);
    }, 300);
  };

  return (
    <AnimatePresence>
      {!clicked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="flex flex-wrap gap-2 mt-3"
        >
          {actions.map((action, index) => (
            <motion.button
              key={action}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(action)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 
                       border border-white/20 rounded-full text-sm text-white
                       transition-all backdrop-blur-sm
                       hover:shadow-lg hover:border-white/30"
            >
              {action}
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

