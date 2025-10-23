'use client';

import { motion } from 'framer-motion';
import { Sparkles, ShoppingCart, MessageSquare, BarChart } from 'lucide-react';

interface QuickStartPrompt {
  icon: any;
  title: string;
  description: string;
  prompt: string;
}

interface EmptyStateProps {
  onPromptSelect?: (prompt: string) => void;
}

export function EmptyState({ onPromptSelect }: EmptyStateProps) {
  const quickStartPrompts: QuickStartPrompt[] = [
    {
      icon: ShoppingCart,
      title: 'E-Commerce Store',
      description: 'Product catalog, cart, and checkout',
      prompt: 'Build an e-commerce platform with product catalog, shopping cart, and checkout',
    },
    {
      icon: MessageSquare,
      title: 'Social Network',
      description: 'Posts, comments, and user profiles',
      prompt: 'Create a social media app with posts, comments, and user profiles',
    },
    {
      icon: BarChart,
      title: 'Dashboard',
      description: 'Analytics, charts, and data views',
      prompt: 'Design an analytics dashboard with charts and data visualization',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[600px] px-8 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 opacity-50" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.4, 0.3],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-4xl"
      >
        {/* Illustration / Icon */}
        <motion.div
          className="w-32 h-32 mx-auto mb-8 relative"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-3xl blur-xl opacity-40" />
          <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <Sparkles className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        {/* Heading */}
        <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Let's Build Something Amazing
        </h2>

        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Your AI assistant is ready to help you create anything. Just start chatting, and I'll guide you through building your perfect app!
        </p>

        {/* Pulsing pointer to AI panel */}
        <motion.div
          className="absolute -right-32 top-1/2 -translate-y-1/2 hidden xl:flex items-center gap-3"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-gray-600 dark:text-gray-400 font-medium">Start chatting here</span>
          <div className="flex items-center gap-1">
            <motion.div
              className="w-3 h-3 bg-indigo-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="w-2 h-2 bg-indigo-400 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.8, 0.3, 0.8],
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-1.5 h-1.5 bg-indigo-300 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.2, 0.6],
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Quick start cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 relative z-10 w-full max-w-5xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {quickStartPrompts.map((prompt, i) => {
          const Icon = prompt.icon;
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPromptSelect?.(prompt.prompt)}
              className="p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm 
                       rounded-2xl border border-gray-200/50 dark:border-gray-700/50
                       shadow-lg hover:shadow-2xl transition-all
                       text-left group relative overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {prompt.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {prompt.description}
                </p>

                {/* Arrow indicator */}
                <motion.div
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </motion.div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Helpful hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-sm text-gray-500 dark:text-gray-400 mt-12 relative z-10"
      >
        💡 Tip: The more details you provide, the better I can help you build your app
      </motion.p>
    </div>
  );
}

