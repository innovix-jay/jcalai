'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, 
  RefreshCw, 
  ExternalLink,
  Lightbulb
} from 'lucide-react';

interface LivePreviewPaneProps {
  projectId: string;
  url?: string | null;
  buildStatus?: 'idle' | 'building' | 'success' | 'error';
  buildProgress?: number;
}

export function LivePreviewPane({ 
  projectId, 
  url, 
  buildStatus = 'idle',
  buildProgress = 0 
}: LivePreviewPaneProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(url || null);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (url) {
      setPreviewUrl(url);
    }
  }, [url]);

  useEffect(() => {
    // Listen for build completion events
    const channel = new BroadcastChannel(`project-${projectId}`);
    channel.onmessage = (event) => {
      if (event.data.type === 'BUILD_COMPLETE') {
        // Reload preview
        if (iframeRef.current) {
          setIsLoading(true);
          iframeRef.current.src = iframeRef.current.src;
        }
      }
      if (event.data.type === 'PREVIEW_URL_UPDATE') {
        setPreviewUrl(event.data.url);
      }
    };

    return () => channel.close();
  }, [projectId]);

  const handleRefresh = () => {
    if (iframeRef.current && previewUrl) {
      setIsLoading(true);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleOpenInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  const hasPreview = !!previewUrl;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-800 to-slate-900">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* macOS Traffic Lights */}
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 cursor-pointer transition-colors" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 cursor-pointer transition-colors" />
            <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 cursor-pointer transition-colors" />
          </div>
          
          {/* Live Preview Label */}
          <div className="ml-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-300">Live Preview</span>
          </div>
        </div>
        
        {/* Right side - actions */}
        <div className="flex items-center gap-2">
          {buildStatus === 'building' && (
            <div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full">
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Building...</span>
            </div>
          )}
          
          <button 
            onClick={handleRefresh}
            disabled={!hasPreview}
            className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button 
            onClick={handleOpenInNewTab}
            disabled={!hasPreview}
            className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex items-center justify-center">
        {!hasPreview ? (
          // Empty State - NO OVERLAPPING TEXT
          <div className="flex flex-col items-center justify-center px-8">
            {/* Icon with glow */}
            <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-purple-500/50">
              <Monitor className="w-12 h-12 text-white" />
            </div>
            
            {/* Heading - Single, clear message */}
            <h3 className="text-2xl font-semibold text-gray-200 mb-3 text-center">
              No Preview Available
            </h3>
            
            {/* Description - Separate element with proper spacing */}
            <p className="text-base text-gray-400 mb-8 text-center max-w-md leading-relaxed">
              Start building to see your app live in this preview pane
            </p>
            
            {/* CTA Button */}
            <button 
              onClick={() => {
                // Switch to AI Chat tab
                const chatTab = document.querySelector('[data-tab="chat"]') as HTMLElement;
                if (chatTab) {
                  chatTab.click();
                  
                  // Focus the chat input after a brief delay for tab transition
                  setTimeout(() => {
                    const chatInput = document.querySelector('[data-chat-input]') as HTMLTextAreaElement;
                    if (chatInput) {
                      chatInput.focus();
                      chatInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }, 150);
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3.5 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Start Building with AI
            </button>
            
            {/* Quick tip */}
            <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
              <Lightbulb className="w-4 h-4" />
              <span>Tip: Use the AI Chat tab to describe what you want to build</span>
            </div>
          </div>
        ) : (
          // Preview with loading overlay
          <div className="w-full h-full relative">
            {/* Loading overlay during build */}
            <AnimatePresence>
              {buildStatus === 'building' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10"
                >
                  <div className="flex flex-col items-center">
                    <svg className="animate-spin w-12 h-12 text-purple-500 mb-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-200 mb-2">Building your app...</p>
                    <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-purple-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${buildProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{buildProgress}% complete</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading state for iframe */}
            {isLoading && (
              <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-5">
                <svg className="animate-spin w-8 h-8 text-purple-500" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            )}
            
            {/* Actual preview iframe */}
            <iframe 
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-0 bg-white"
              title="App Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
