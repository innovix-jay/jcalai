'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProjectSync } from '@/lib/hooks/use-project-sync';
import { useAuth } from '@/lib/hooks/use-auth';
import { 
  Plus, 
  FileText, 
  Component, 
  Database, 
  Settings,
  Play,
  Square,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BuilderCanvasProps {
  projectId: string;
  isBuilding?: boolean;
  buildProgress?: number;
}

export function BuilderCanvas({ projectId, isBuilding: propIsBuilding, buildProgress: propBuildProgress }: BuilderCanvasProps) {
  const { user } = useAuth();
  const { projects } = useProjectSync(user?.id || '');
  const [isBuilding, setIsBuilding] = useState(propIsBuilding || false);
  const [buildProgress, setBuildProgress] = useState(propBuildProgress || 0);

  const currentProject = projects.find(p => p.id === projectId);

  const handleStartBuild = async () => {
    if (!currentProject) return;

    setIsBuilding(true);
    setBuildProgress(0);

    try {
      // Simulate build process with real progress updates
      const steps = [
        'Analyzing project requirements...',
        'Generating project structure...',
        'Creating database schema...',
        'Building authentication system...',
        'Generating UI components...',
        'Setting up API endpoints...',
        'Configuring deployment...',
        'Finalizing build...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setBuildProgress(Math.round(((i + 1) / steps.length) * 100));
        
        // Broadcast build progress
        const channel = new BroadcastChannel(`project-${projectId}`);
        channel.postMessage({
          type: 'BUILD_PROGRESS',
          step: steps[i],
          progress: Math.round(((i + 1) / steps.length) * 100)
        });

        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate work
      }

      // Broadcast build completion
      const channel = new BroadcastChannel(`project-${projectId}`);
      channel.postMessage({
        type: 'BUILD_COMPLETE',
        previewUrl: `https://preview-${projectId}.jcalai.com`
      });

    } catch (error) {
      console.error('Build failed:', error);
    } finally {
      setIsBuilding(false);
    }
  };

  const handleStopBuild = () => {
    setIsBuilding(false);
    setBuildProgress(0);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Canvas Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Project Canvas
          </h2>
          <div className="flex items-center gap-2">
            {isBuilding ? (
              <Button
                onClick={handleStopBuild}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            ) : (
              <Button
                onClick={handleStartBuild}
                size="sm"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Build
              </Button>
            )}
          </div>
        </div>

        {/* Build Progress */}
        {isBuilding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Building your app... {buildProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${buildProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Canvas Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {currentProject ? (
          <div className="space-y-6">
            {/* Project Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Project Name
                    </label>
                    <p className="text-gray-900 dark:text-white">{currentProject.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Description
                    </label>
                    <p className="text-gray-900 dark:text-white">{currentProject.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Status
                    </label>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        currentProject.build_status === 'completed' ? 'bg-green-500' :
                        currentProject.build_status === 'in-progress' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`} />
                      <span className="text-sm text-gray-900 dark:text-white capitalize">
                        {currentProject.build_status}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Component className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12 flex flex-col gap-1">
                    <Plus className="w-4 h-4" />
                    <span className="text-xs">Add Page</span>
                  </Button>
                  <Button variant="outline" className="h-12 flex flex-col gap-1">
                    <Component className="w-4 h-4" />
                    <span className="text-xs">Add Component</span>
                  </Button>
                  <Button variant="outline" className="h-12 flex flex-col gap-1">
                    <Database className="w-4 h-4" />
                    <span className="text-xs">Database</span>
                  </Button>
                  <Button variant="outline" className="h-12 flex flex-col gap-1">
                    <Settings className="w-4 h-4" />
                    <span className="text-xs">Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Project Structure */}
            <Card>
              <CardHeader>
                <CardTitle>Project Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                      <FileText className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    pages/
                  </div>
                  <div className="ml-6 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                      <div className="w-3 h-3 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center">
                        <FileText className="w-2 h-2 text-green-600 dark:text-green-400" />
                      </div>
                      index.tsx
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-4 h-4 bg-purple-100 dark:bg-purple-900 rounded flex items-center justify-center">
                      <Component className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    </div>
                    components/
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-4 h-4 bg-orange-100 dark:bg-orange-900 rounded flex items-center justify-center">
                      <Database className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                    </div>
                    database/
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">Loading project...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
