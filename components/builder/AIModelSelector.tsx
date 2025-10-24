'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

type AIProvider = 'auto' | 'claude' | 'gpt' | 'gemini';

const AI_MODELS = [
  {
    id: 'auto',
    name: 'Auto Select',
    description: 'AI picks the best model for each task',
    icon: '✨',
    badge: 'Recommended'
  },
  {
    id: 'claude',
    name: 'Claude Sonnet 4.5',
    description: 'Best for architecture & complex logic',
    icon: '🧠',
    badge: 'Highest Quality'
  },
  {
    id: 'gpt',
    name: 'GPT-4o',
    description: 'Best for UI design & rapid iteration',
    icon: '⚡',
    badge: 'Fastest'
  },
  {
    id: 'gemini',
    name: 'Gemini 2.0',
    description: 'Best for database & optimization',
    icon: '💎',
    badge: 'Most Efficient'
  }
];

export function AIModelSelector({ 
  currentModel, 
  onModelChange 
}: { 
  currentModel: AIProvider; 
  onModelChange: (model: AIProvider) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const selectedModel = AI_MODELS.find(m => m.id === currentModel);

  return (
    <div className="relative">
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 
                   border border-gray-200 dark:border-gray-700 rounded-lg
                   hover:border-indigo-500 transition-colors"
      >
        <span className="text-2xl">{selectedModel?.icon}</span>
        <div className="text-left">
          <div className="text-sm font-medium">{selectedModel?.name}</div>
          <div className="text-xs text-gray-500">Click to change</div>
        </div>
        <ChevronDownIcon className="w-4 h-4 ml-2" />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-gray-900
                       border border-gray-200 dark:border-gray-700 rounded-xl
                       shadow-2xl z-50 p-2"
          >
            <div className="space-y-1">
              {AI_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id as AIProvider);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg text-left
                    transition-colors ${
                      currentModel === model.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  <span className="text-3xl">{model.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{model.name}</span>
                      <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 
                                     text-indigo-700 dark:text-indigo-300 
                                     text-xs rounded-full">
                        {model.badge}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {model.description}
                    </p>
                  </div>
                  {currentModel === model.id && (
                    <CheckIcon className="w-5 h-5 text-indigo-600" />
                  )}
                </button>
              ))}
            </div>

            {/* Compare Models Button */}
            <button
              onClick={() => {
                setShowComparison(true);
                setIsOpen(false);
              }}
              className="w-full mt-2 px-4 py-2 border-t border-gray-200 
                         dark:border-gray-700 text-sm text-indigo-600 
                         hover:text-indigo-700 font-medium"
            >
              Compare All Models →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparison && (
          <ModelComparisonModal onClose={() => setShowComparison(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ModelComparisonModal({ onClose }: { onClose: () => void }) {
  const comparisonData = [
    {
      model: 'Claude Sonnet 4.5',
      icon: '🧠',
      strengths: ['Architecture', 'Complex Logic', 'Code Review'],
      weaknesses: ['Speed'],
      cost: '$15/1M tokens',
      speed: '8/10'
    },
    {
      model: 'GPT-4o',
      icon: '⚡',
      strengths: ['UI Design', 'Rapid Iteration', 'Testing'],
      weaknesses: ['Context Length'],
      cost: '$5/1M tokens',
      speed: '9/10'
    },
    {
      model: 'Gemini 2.0',
      icon: '💎',
      strengths: ['Database', 'Optimization', 'Cost Efficiency'],
      weaknesses: ['Complex Reasoning'],
      cost: '$1/1M tokens',
      speed: '10/10'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 
                 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl 
                   w-full max-w-4xl max-h-[80vh] overflow-y-auto"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">AI Model Comparison</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comparisonData.map((model, index) => (
              <motion.div
                key={model.model}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl"
              >
                <div className="text-center mb-4">
                  <span className="text-4xl">{model.icon}</span>
                  <h3 className="text-xl font-semibold mt-2">{model.model}</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
                    <ul className="text-sm space-y-1">
                      {model.strengths.map((strength, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-orange-600 mb-2">Weaknesses</h4>
                    <ul className="text-sm space-y-1">
                      {model.weaknesses.map((weakness, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Cost:</span>
                      <div className="font-medium">{model.cost}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Speed:</span>
                      <div className="font-medium">{model.speed}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
            <h3 className="font-semibold mb-2">💡 Recommendation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use <strong>Auto Select</strong> for the best experience. JCAL.ai will automatically 
              choose the optimal model for each task, combining the strengths of all three AI systems.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
