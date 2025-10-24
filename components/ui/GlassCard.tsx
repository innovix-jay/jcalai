'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function GlassCard({ 
  children, 
  className = '',
  hover = true,
  glow = false
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hover ? {
        y: -4,
        boxShadow: glow 
          ? '0 25px 50px -12px rgba(99, 102, 241, 0.5)'
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      } : undefined}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-white/10 backdrop-blur-xl rounded-3xl 
                  border border-white/20 shadow-2xl p-6
                  ${glow ? 'shadow-indigo-500/30' : ''}
                  ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function GlassButton({
  children,
  onClick,
  className = '',
  variant = 'default'
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary';
}) {
  const variants = {
    default: 'bg-white/10 text-white border-white/20',
    primary: 'bg-white text-indigo-900 border-white',
    secondary: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-6 py-3 backdrop-blur-md rounded-xl
                  border transition-all duration-300
                  font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function GlassPanel({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white/10 backdrop-blur-2xl rounded-3xl
                     border border-white/20 shadow-2xl
                     ${className}`}>
      {children}
    </div>
  );
}

