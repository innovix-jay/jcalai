'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, Command } from 'lucide-react';

export function NaturalLanguageInput({ projectId }: { projectId: string }) {
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);

  useEffect(() => {
    // Keyboard shortcut Cmd/Ctrl + K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!command.trim() || isProcessing) return;

    setIsProcessing(true);

    try {
      const response = await fetch('/api/ai/natural-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, command })
      });

      const result = await response.json();

      // Trigger hot reload
      window.dispatchEvent(new CustomEvent('trigger-hot-reload', {
        detail: { files: result.updatedFiles }
      }));

      // Show success notification
      showNotification(`✨ ${result.description}`, 'success');

      // Add to recent commands
      setRecentCommands(prev => [command, ...prev.slice(0, 4)]);
      setCommand('');
    } catch (error: any) {
      showNotification(`Failed: ${error.message}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const commonCommands = [
    'Make the header sticky',
    'Add a loading spinner',
    'Change button color to blue',
    'Make text bigger',
    'Add a footer',
    'Center this content',
    'Make it responsive',
    'Add shadows to cards',
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isVisible && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsVisible(true)}
            className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 
                       text-white rounded-full shadow-2xl flex items-center justify-center z-40
                       hover:shadow-indigo-500/50 transition-all"
          >
            <Sparkles className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Input Panel */}
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVisible(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Input Panel */}
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl 
                             border-2 border-indigo-500/20 overflow-hidden">
                {/* Input Area */}
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 
                                    rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>

                    <input
                      type="text"
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      placeholder='Try: "make the header sticky" or "change button to blue"'
                      className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl 
                                 border border-gray-200 dark:border-gray-700
                                 focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                 text-gray-900 dark:text-white placeholder-gray-500
                                 text-base"
                      disabled={isProcessing}
                      autoFocus
                    />

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isProcessing || !command.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600
                                 text-white rounded-xl font-medium disabled:opacity-50
                                 flex items-center gap-2 transition-all"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      Apply
                    </motion.button>
                  </div>

                  {/* Quick Suggestions */}
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Quick suggestions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {commonCommands.map((cmd) => (
                        <button
                          key={cmd}
                          type="button"
                          onClick={() => setCommand(cmd)}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 
                                     hover:bg-indigo-50 dark:hover:bg-indigo-900/20
                                     rounded-lg text-xs text-gray-700 dark:text-gray-300
                                     hover:text-indigo-600 dark:hover:text-indigo-400
                                     transition-colors"
                        >
                          {cmd}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recent Commands */}
                  {recentCommands.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Recent commands:
                      </p>
                      <div className="space-y-1">
                        {recentCommands.map((cmd, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setCommand(cmd)}
                            className="w-full text-left px-3 py-2 bg-gray-50 dark:bg-gray-800/50
                                       hover:bg-gray-100 dark:hover:bg-gray-800
                                       rounded-lg text-sm text-gray-700 dark:text-gray-300
                                       transition-colors"
                          >
                            {cmd}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Keyboard Hint */}
                  <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center flex items-center justify-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
                        <Command className="w-3 h-3 inline" /> K
                      </kbd> 
                      to toggle
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
                        Enter
                      </kbd> 
                      to apply
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
                        Esc
                      </kbd> 
                      to close
                    </span>
                  </p>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function showNotification(message: string, type: 'success' | 'error') {
  // TODO: Implement toast notification
  if (type === 'success') {
    console.log('✅', message);
  } else {
    console.error('❌', message);
  }
}
