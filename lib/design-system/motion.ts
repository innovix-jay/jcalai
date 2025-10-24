import { Variants } from 'framer-motion';

// Smooth animations used throughout - Gemini-style
export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const slideIn: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export const slideInRight: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export const scaleIn: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const shimmerAnimation = {
  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "linear"
  }
};

// Glassmorphism styles - Gemini-inspired
export const glassPanel = `
  bg-white/10 
  backdrop-blur-xl 
  border border-white/20 
  shadow-2xl
`;

export const glassButton = `
  bg-white/10 
  backdrop-blur-md 
  border border-white/20 
  hover:bg-white/20 
  transition-all
  duration-300
`;

export const gradientText = `
  bg-gradient-to-r 
  from-indigo-400 
  via-purple-400 
  to-pink-400 
  bg-clip-text 
  text-transparent
`;

export const glowEffect = `
  shadow-lg
  shadow-indigo-500/50
`;

// Easing curves for natural motion
export const easings = {
  easeOutExpo: [0.19, 1, 0.22, 1],
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOut: [0.65, 0, 0.35, 1],
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30
  }
};

