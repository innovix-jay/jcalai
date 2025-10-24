'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { CheckCircle, Loader2, Sparkles } from 'lucide-react';

interface BuildStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  estimatedTime?: string;
}

interface BuildProgressProps {
  isVisible: boolean;
  currentStep?: string;
  progress?: number;
  onComplete?: () => void;
}

export function BuildProgress({
  isVisible,
  currentStep,
  progress = 0,
  onComplete,
}: BuildProgressProps) {
  const [steps, setSteps] = useState<BuildStep[]>([
    {
      id: 'setup',
      title: 'Setting up project',
      description: 'Creating project structure and configuration',
      status: 'pending',
      estimatedTime: '10s',
    },
    {
      id: 'pages',
      title: 'Generating pages',
      description: 'Building your pages with AI',
      status: 'pending',
      estimatedTime: '30s',
    },
    {
      id: 'components',
      title: 'Creating components',
      description: 'Designing reusable UI components',
      status: 'pending',
      estimatedTime: '20s',
    },
    {
      id: 'database',
      title: 'Setting up database',
      description: 'Creating tables and relationships',
      status: 'pending',
      estimatedTime: '15s',
    },
    {
      id: 'finalize',
      title: 'Finalizing',
      description: 'Applying finishing touches',
      status: 'pending',
      estimatedTime: '5s',
    },
  ]);

  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  // Update steps based on current progress
  useEffect(() => {
    if (currentStep) {
      setSteps(prev =>
        prev.map(step => {
          const stepIndex = prev.findIndex(s => s.id === step.id);
          const currentIndex = prev.findIndex(s => s.id === currentStep);

          if (stepIndex < currentIndex) {
            return { ...step, status: 'completed' };
          } else if (stepIndex === currentIndex) {
            return { ...step, status: 'in_progress' };
          } else {
            return { ...step, status: 'pending' };
          }
        })
      );
    }
  }, [currentStep]);

  // Show confetti on completion
  useEffect(() => {
    if (progress >= 100) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        onComplete?.();
      }, 5000);
    }
  }, [progress, onComplete]);

  if (!isVisible) return null;

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const totalSteps = steps.length;

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={500}
          recycle={false}
          gravity={0.3}
        />
      )}

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 w-96 bg-white/95 dark:bg-gray-900/95 
                     backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 
                     dark:border-gray-700/50 overflow-hidden z-40"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-white">
                {progress >= 100 ? '🎉 Build Complete!' : 'Building Your App...'}
              </h3>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-white rounded-full"
              />
            </div>

            <div className="flex justify-between mt-2 text-sm text-white/90">
              <span>
                {completedSteps} of {totalSteps} steps
              </span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Steps */}
          <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-1">
                  {step.status === 'completed' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15 }}
                    >
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </motion.div>
                  )}
                  {step.status === 'in_progress' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-6 h-6 text-indigo-500" />
                    </motion.div>
                  )}
                  {step.status === 'pending' && (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                  )}
                  {step.status === 'error' && (
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                      !
                    </div>
                  )}
                </div>

                {/* Step Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4
                      className={`font-semibold ${
                        step.status === 'in_progress'
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : step.status === 'completed'
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {step.title}
                    </h4>
                    {step.status === 'pending' && step.estimatedTime && (
                      <span className="text-xs text-gray-500">{step.estimatedTime}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>

                  {/* Mini progress bar for current step */}
                  {step.status === 'in_progress' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                        animate={{ width: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Success Message */}
          {progress >= 100 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-t border-green-200 dark:border-green-800"
            >
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h4 className="font-bold text-green-900 dark:text-green-100">
                  Your app is ready!
                </h4>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 ml-9">
                All components have been generated. You can now customize and deploy.
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

