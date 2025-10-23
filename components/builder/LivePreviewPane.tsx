'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  RefreshCw, 
  ExternalLink,
  AlertCircle,
  Loader2,
  Zap
} from 'lucide-react';
import { useHotReload } from '@/lib/hooks/use-hot-reload';

interface LivePreviewPaneProps {
  projectId: string;
  url?: string | null;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export function LivePreviewPane({ projectId, url }: LivePreviewPaneProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');
  const [previewUrl, setPreviewUrl] = useState<string | null>(url || null);
  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);
  
  const { iframeRef, isConnected, lastUpdate, buildTime } = useHotReload(
    projectId,
    (update) => {
      if (update.buildTime) {
        // Show update indicator
        setShowUpdateIndicator(true);
        setTimeout(() => setShowUpdateIndicator(false), 3000);
      }
      if (update.error) {
        setError(update.error);
      }
    }
  );

  useEffect(() => {
    // Listen for build completion events
    const channel = new BroadcastChannel(`project-${projectId}`);
    channel.onmessage = (event) => {
      if (event.data.type === 'BUILD_COMPLETE') {
        // Reload preview
        if (iframeRef.current) {
          iframeRef.current.src = iframeRef.current.src;
        }
      }
      if (event.data.type === 'PREVIEW_URL_UPDATE') {
        setPreviewUrl(event.data.url);
      }
    };

    return () => channel.close();
  }, [projectId]);

  const viewportSizes = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      setError(null);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleOpenInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Preview Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Live Preview</span>
          
          {/* Hot Reload Status */}
          {isConnected && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                Hot Reload Active
              </span>
            </div>
          )}
          
          {/* Update Indicator */}
          <AnimatePresence>
            {showUpdateIndicator && buildTime !== null && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 
                           dark:from-green-900/20 dark:to-emerald-900/20
                           text-green-700 dark:text-green-400 rounded-full text-xs font-medium
                           border border-green-200 dark:border-green-800"
              >
                <Zap className="w-3 h-3" />
                Updated in {buildTime}ms
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport Selectors */}
          <button 
            onClick={() => setViewportSize('desktop')}
            className={`p-2 rounded-lg transition-colors ${
              viewportSize === 'desktop' 
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewportSize('tablet')}
            className={`p-2 rounded-lg transition-colors ${
              viewportSize === 'tablet' 
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewportSize('mobile')}
            className={`p-2 rounded-lg transition-colors ${
              viewportSize === 'mobile' 
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />

          {/* Refresh Button */}
          <button 
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Open in New Tab */}
          <button 
            onClick={handleOpenInNewTab}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            disabled={!previewUrl}
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative bg-white dark:bg-gray-900 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-indigo-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading preview...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview unavailable</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">{error}</p>
              <button 
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!previewUrl && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Monitor className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">No preview available</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Start building to see your app live</p>
            </div>
          </div>
        )}

        {previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full flex items-center justify-center"
            style={{
              backgroundColor: viewportSize !== 'desktop' ? '#f3f4f6' : 'transparent'
            }}
          >
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="border-0 bg-white shadow-lg"
              style={{
                width: viewportSizes[viewportSize].width,
                height: viewportSizes[viewportSize].height,
                maxWidth: '100%',
                maxHeight: '100%'
              }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setError('Failed to load preview');
                setIsLoading(false);
              }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
