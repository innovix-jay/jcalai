'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Eye, 
  EyeOff, 
  Play, 
  Square, 
  Download,
  Settings,
  Share2,
  MoreHorizontal,
  Rocket,
  History,
  Grid3x3,
  Wand2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeployButton } from './DeployButton';
import { ExportButton } from './ExportButton';

interface BuilderToolbarProps {
  projectId: string;
  projectName: string;
  showPreview: boolean;
  onTogglePreview: () => void;
  onStartBuild?: () => void;
  onStopBuild?: () => void;
  isBuilding?: boolean;
  onShowComponentLibrary?: () => void;
  onShowVersionHistory?: () => void;
}

export function BuilderToolbar({ 
  projectId, 
  projectName, 
  showPreview, 
  onTogglePreview,
  onStartBuild,
  onStopBuild,
  isBuilding = false,
  onShowComponentLibrary,
  onShowVersionHistory
}: BuilderToolbarProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 
                    flex items-center justify-between px-6 flex-shrink-0">
      
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {projectName}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              JCAL.ai Builder
            </p>
          </div>
        </div>
      </div>

      {/* Center Section - Build Controls */}
      <div className="flex items-center gap-3">
        {isBuilding ? (
          <Button
            onClick={onStopBuild}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Square className="w-4 h-4 mr-2" />
            Stop Build
          </Button>
        ) : (
          <Button
            onClick={onStartBuild}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Build
          </Button>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Component Library */}
        <Button
          onClick={onShowComponentLibrary}
          variant="outline"
          size="sm"
          className="border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <Grid3x3 className="w-4 h-4 mr-2" />
          Components
        </Button>

        {/* Version History */}
        <Button
          onClick={onShowVersionHistory}
          variant="outline"
          size="sm"
          className="border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <History className="w-4 h-4 mr-2" />
          History
        </Button>

        {/* Export Code */}
        <ExportButton projectId={projectId} projectName={projectName} />

        {/* Deploy to Vercel */}
        <DeployButton projectId={projectId} projectName={projectName} />

        {/* Preview Toggle */}
        <Button
          onClick={onTogglePreview}
          variant={showPreview ? "default" : "outline"}
          size="sm"
          className={showPreview 
            ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
            : "border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          }
        >
          {showPreview ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </Button>

        {/* More Actions */}
        <div className="relative">
          <Button
            onClick={() => setShowMore(!showMore)}
            variant="outline"
            size="icon"
            className="border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>

          {/* More Actions Dropdown */}
          {showMore && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 
                         rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 
                         py-2 z-50"
            >
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 
                                 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Code
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 
                                 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share Project
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 
                                 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Project Settings
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
