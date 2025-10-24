'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function OptimizationPanel({ projectId }: { projectId: string }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const analyzeSite = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(`/api/optimize/analyze?projectId=${projectId}`);
      const data = await response.json();
      setSuggestions(data.suggestions);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyAll = async () => {
    setIsOptimizing(true);
    try {
      const autoFixable = suggestions.filter(s => s.autoFixable).map(s => s.id);
      await fetch('/api/optimize/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, optimizationIds: autoFixable })
      });
      showToast('✨ Optimizations applied!', 'success');
      analyzeSite(); // Refresh
    } finally {
      setIsOptimizing(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Auto-Optimization</h2>
          <p className="text-gray-600">AI-powered performance improvements</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={analyzeSite}
            disabled={isAnalyzing}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            {isAnalyzing ? 'Analyzing...' : '🔍 Analyze'}
          </button>
          <button
            onClick={applyAll}
            disabled={isOptimizing || suggestions.length === 0}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {isOptimizing ? 'Optimizing...' : '⚡ Apply All'}
          </button>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {suggestions.map((suggestion, i) => (
          <OptimizationCard key={i} suggestion={suggestion} />
        ))}
      </div>
    </div>
  );
}

function OptimizationCard({ suggestion }: any) {
  const severityColors = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border rounded-xl hover:border-indigo-500 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 text-xs rounded-full ${severityColors[suggestion.severity]}`}>
              {suggestion.severity}
            </span>
            <span className="text-xs text-gray-500">{suggestion.type}</span>
            {suggestion.autoFixable && (
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                Auto-fixable
              </span>
            )}
          </div>
          <h3 className="font-semibold mb-1">{suggestion.title}</h3>
          <p className="text-sm text-gray-600 mb-4">{suggestion.description}</p>
          <p className="text-sm text-indigo-600">💡 {suggestion.impact}</p>
        </div>
        <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
          Apply
        </button>
      </div>
    </motion.div>
  );
}
