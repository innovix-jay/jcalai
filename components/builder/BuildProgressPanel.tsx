'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuildProgress } from '@/lib/hooks/use-project-sync';
import { 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Loader2,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface BuildStep {
  id: string;
  step_id: string;
  step_label: string;
  status: 'pending' | 'in-progress' | 'complete' | 'error';
  logs: string[];
  created_at: string;
  completed_at?: string;
}

export function BuildProgressPanel({ projectId }: { projectId: string }) {
  const { buildLogs, buildSession, loading } = useBuildProgress(projectId);
  const [isExpanded, setIsExpanded] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    if (buildSession) {
      const progress = buildSession.total_steps > 0 
        ? Math.round((buildSession.completed_steps / buildSession.total_steps) * 100)
        : 0;
      setOverallProgress(progress);
    }
  }, [buildSession]);

  if (loading || !buildSession || buildLogs.length === 0) {
    return null;
  }

  const steps: BuildStep[] = buildLogs.map(log => ({
    id: log.id,
    step_id: log.step_id,
    step_label: log.step_label,
    status: log.status,
    logs: log.logs || [],
    created_at: log.created_at,
    completed_at: log.completed_at
  }));

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-6 right-6 w-[420px] bg-white dark:bg-gray-900 
                 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800
                 overflow-hidden z-50"
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-6 py-4 bg-gradient-to-r 
                   from-indigo-500 to-purple-600 text-white cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-lg">Building Your App</h3>
            <p className="text-sm text-white/80">{overallProgress}% Complete</p>
          </div>
        </div>
        <button>
          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1.5 bg-gray-200 dark:bg-gray-800">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-600"
          initial={{ width: 0 }}
          animate={{ width: `${overallProgress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Build Steps */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
              {steps.map((step, index) => (
                <BuildStepItem key={step.id} step={step} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function BuildStepItem({ step, index }: { step: BuildStep; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start gap-3"
    >
      {/* Status Icon */}
      <div className="flex-shrink-0 mt-1">
        {step.status === 'complete' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-6 h-6 text-green-500" />
          </motion.div>
        )}
        {step.status === 'in-progress' && (
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        )}
        {step.status === 'pending' && (
          <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
        )}
        {step.status === 'error' && (
          <XCircle className="w-6 h-6 text-red-500" />
        )}
      </div>

      {/* Step Content */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${
          step.status === 'complete' ? 'text-gray-600 dark:text-gray-400' : 
          'text-gray-900 dark:text-white'
        }`}>
          {step.step_label}
        </p>

        {/* Logs */}
        {step.logs && step.logs.length > 0 && (
          <div className="mt-2 space-y-1">
            {step.logs.slice(-3).map((log, i) => (
              <p key={i} className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                {log}
              </p>
            ))}
          </div>
        )}

        {/* Timestamp */}
        {step.completed_at && (
          <p className="text-xs text-gray-400 mt-1">
            Completed at {new Date(step.completed_at).toLocaleTimeString()}
          </p>
        )}
      </div>
    </motion.div>
  );
}
