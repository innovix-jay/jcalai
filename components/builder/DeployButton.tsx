'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, CheckCircle, XCircle, Loader2, ExternalLink, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeploymentStatus {
  status: 'idle' | 'deploying' | 'success' | 'error';
  url?: string;
  deploymentId?: string;
  error?: string;
  progress?: number;
}

export function DeployButton({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>({ status: 'idle' });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleProgress = (event: any) => {
      if (event.detail.deploymentId) {
        setDeploymentStatus(prev => ({
          ...prev,
          progress: event.detail.progress
        }));
      }
    };

    window.addEventListener('deployment-progress', handleProgress);
    return () => window.removeEventListener('deployment-progress', handleProgress);
  }, []);

  const handleDeploy = async () => {
    setDeploymentStatus({ status: 'deploying', progress: 0 });
    setShowModal(true);

    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, projectName })
      });

      const result = await response.json();

      if (result.success) {
        setDeploymentStatus({
          status: 'success',
          url: result.url,
          deploymentId: result.deploymentId
        });
      } else {
        setDeploymentStatus({
          status: 'error',
          error: result.error || 'Deployment failed'
        });
      }
    } catch (error: any) {
      setDeploymentStatus({
        status: 'error',
        error: error.message
      });
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDeploy}
        disabled={deploymentStatus.status === 'deploying'}
        className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium
                   flex items-center gap-2 disabled:opacity-50 transition-all hover:shadow-lg"
      >
        {deploymentStatus.status === 'deploying' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Rocket className="w-4 h-4" />
        )}
        {deploymentStatus.status === 'deploying' ? 'Deploying...' : 'Deploy to Vercel'}
      </motion.button>

      {/* Deployment Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 
                       flex items-center justify-center p-4"
            onClick={() => deploymentStatus.status !== 'deploying' && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl 
                         max-w-lg w-full p-8"
            >
              {deploymentStatus.status === 'deploying' && (
                <DeployingState progress={deploymentStatus.progress || 0} />
              )}
              {deploymentStatus.status === 'success' && (
                <DeploymentSuccess url={deploymentStatus.url!} />
              )}
              {deploymentStatus.status === 'error' && (
                <DeploymentError message={deploymentStatus.error!} onRetry={handleDeploy} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function DeployingState({ progress }: { progress: number }) {
  const steps = [
    { label: 'Preparing files', threshold: 20 },
    { label: 'Uploading to Vercel', threshold: 40 },
    { label: 'Building project', threshold: 70 },
    { label: 'Assigning domain', threshold: 90 },
    { label: 'Finalizing deployment', threshold: 100 }
  ];

  return (
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 mx-auto mb-6"
      >
        <Rocket className="w-16 h-16 text-indigo-600" />
      </motion.div>
      <h3 className="text-2xl font-bold mb-2">Deploying to Vercel</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        This usually takes 30-60 seconds...
      </p>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
        <motion.div
          className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="space-y-3 text-left">
        {steps.map((step, index) => {
          const isComplete = progress >= step.threshold;
          const isActive = progress >= (steps[index - 1]?.threshold || 0) && progress < step.threshold;

          return (
            <DeployStep
              key={step.label}
              status={isComplete ? 'complete' : isActive ? 'in-progress' : 'pending'}
              label={step.label}
            />
          );
        })}
      </div>
    </div>
  );
}

function DeploymentSuccess({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full 
                   flex items-center justify-center"
      >
        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
      </motion.div>

      <h3 className="text-2xl font-bold mb-2">🎉 Deployed Successfully!</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Your app is now live on the internet
      </p>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl mb-6">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Your app is live at:
        </p>
        <div className="flex items-center gap-2">
          <a 
            href={url} 
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 
                       font-medium break-all text-left"
          >
            {url}
          </a>
          <button
            onClick={copyUrl}
            className="px-3 py-2 bg-white dark:bg-gray-700 rounded-lg border 
                       border-gray-200 dark:border-gray-600 hover:bg-gray-50 
                       dark:hover:bg-gray-600 transition-colors"
          >
            {copied ? '✓' : '📋'}
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => window.open(url, '_blank')}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                     text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 
                     font-medium flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Visit Site
        </button>
        <button
          onClick={() => {/* TODO: Open domain modal */}}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     hover:bg-gray-50 dark:hover:bg-gray-800 font-medium
                     flex items-center justify-center gap-2"
        >
          <Globe className="w-4 h-4" />
          Add Domain
        </button>
      </div>
    </div>
  );
}

function DeploymentError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full 
                   flex items-center justify-center"
      >
        <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
      </motion.div>

      <h3 className="text-2xl font-bold mb-2">Deployment Failed</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {message}
      </p>

      <button
        onClick={onRetry}
        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                   text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 
                   font-medium"
      >
        Try Again
      </button>
    </div>
  );
}

function DeployStep({ 
  status, 
  label 
}: { 
  status: 'pending' | 'in-progress' | 'complete' | 'error'; 
  label: string; 
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">
        {status === 'complete' && (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
        {status === 'in-progress' && (
          <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
        )}
        {status === 'pending' && (
          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
        )}
      </div>
      <p className={`text-sm ${
        status === 'complete' ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'
      }`}>
        {label}
      </p>
    </div>
  );
}
