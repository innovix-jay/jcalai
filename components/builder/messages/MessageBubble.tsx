'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import type { ConversationMessage } from '@/types/onboarding';
import { Sparkles, User } from 'lucide-react';

interface MessageBubbleProps {
  message: ConversationMessage;
  isLatest?: boolean;
}

export function MessageBubble({ message, isLatest = false }: MessageBubbleProps) {
  const isAI = message.role === 'ai';
  const isSystem = message.role === 'system';
  const isError = message.role === 'error';

  // Handle system and error messages differently
  if (isSystem || isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex justify-center mb-4"
      >
        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
          isError 
            ? 'bg-red-100 text-red-800 border border-red-200' 
            : 'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {message.content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
    >
      {isAI && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} max-w-[80%]`}>
        <div
          className={`
            px-4 py-3 rounded-2xl shadow-md
            ${isAI 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-bl-none' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-br-none'
            }
          `}
        >
          <div className={`prose prose-sm max-w-none ${isAI ? 'prose-invert prose-white' : ''}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="my-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="my-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="ml-4">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                code: ({ inline, children, ...props }: any) =>
                  inline ? (
                    <code className={`px-1.5 py-0.5 rounded font-mono text-sm ${
                      isAI 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {children}
                    </code>
                  ) : (
                    <code
                      className={`block p-3 rounded-lg font-mono text-sm overflow-x-auto my-2 ${
                        isAI 
                          ? 'bg-white/10 text-white border border-white/20' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
                      }`}
                      {...props}
                    >
                      {children}
                    </code>
                  ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
        
        <span className="text-xs text-gray-500 mt-1 px-1">
          {format(new Date(message.timestamp), 'p')}
        </span>
      </div>

      {!isAI && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </div>
      )}
    </motion.div>
  );
}

