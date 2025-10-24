'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { BuilderPane } from '@/components/builder/BuilderPane';
import { LivePreviewPane } from '@/components/builder/LivePreviewPane';
import { ComponentLibrary } from '@/components/builder/ComponentLibrary';
import { VersionHistory } from '@/components/builder/VersionHistory';
import { VoiceController } from '@/components/builder/VoiceController';
import type { AIProvider } from '@/lib/ai/model-router';
import toast from 'react-hot-toast';
import { ArrowLeft, Play, StopCircle, Package, History, Download, ExternalLink, MoreHorizontal } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;
  
  const [project, setProject] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [selectedModel, setSelectedModel] = useState<AIProvider>('auto');
  const [showPreview, setShowPreview] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showComponentLibrary, setShowComponentLibrary] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  // Load project data
  const loadProject = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);

    try {
      // Load project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Load pages
      const { data: pagesData, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index');

      if (pagesError) throw pagesError;
      setPages(pagesData || []);

      // Set preview URL if available
      if (projectData?.preview_url) {
        setPreviewUrl(projectData.preview_url);
      }

    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Failed to load project.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  // Handle project update from Overview tab
  const handleProjectUpdate = async (updates: any) => {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId);

    if (error) throw error;
    
    // Update local state
    setProject((prev: any) => ({ ...prev, ...updates }));
  };

  // Handle start build
  const handleStartBuild = async () => {
    setIsBuilding(true);
    setBuildProgress(0);
    
    try {
      // TODO: Implement actual build logic
      toast.success('Build started!');
      
      // Simulate build progress
      for (let i = 0; i <= 100; i += 10) {
        setBuildProgress(i);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      toast.success('Build complete!');
      await loadProject(); // Reload to show changes
    } catch (error) {
      toast.error('Build failed');
    } finally {
      setIsBuilding(false);
    }
  };

  // Handle stop build
  const handleStopBuild = () => {
    setIsBuilding(false);
    setBuildProgress(0);
    toast('Build stopped', { icon: 'ℹ️' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Project Not Found</h1>
          <p className="text-gray-600">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header with Standardized Buttons */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {project.name || 'Untitled Project'}
            </h1>
            <p className="text-xs text-gray-500">JCAL.ai Builder</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Primary Action */}
          {isBuilding ? (
            <button
              onClick={handleStopBuild}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg
                       font-medium transition-all flex items-center gap-2 h-10"
            >
              <StopCircle className="w-4 h-4" />
              Stop Build
            </button>
          ) : (
            <button
              onClick={handleStartBuild}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg
                       font-medium transition-all flex items-center gap-2 h-10"
            >
              <Play className="w-4 h-4" />
              Start Build
            </button>
          )}

          {/* Secondary Actions */}
          <button
            onClick={() => setShowComponentLibrary(true)}
            className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg
                     hover:bg-purple-50 transition-all flex items-center gap-2 h-10"
          >
            <Package className="w-4 h-4" />
            Components
          </button>

          <button
            onClick={() => setShowVersionHistory(true)}
            className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg
                     hover:bg-purple-50 transition-all flex items-center gap-2 h-10"
          >
            <History className="w-4 h-4" />
            History
          </button>

          {/* Tertiary Actions */}
          <button
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg
                     transition-all flex items-center gap-2 h-10"
          >
            <Download className="w-4 h-4" />
            Export Code
          </button>

          <button
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg
                     transition-all flex items-center gap-2 h-10"
          >
            <ExternalLink className="w-4 h-4" />
            Deploy
          </button>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg
                     hover:bg-gray-50 transition-all h-10"
          >
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>

          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <Allotment defaultSizes={showPreview ? [40, 60] : [100, 0]}>
          {/* Left: Builder Pane with Tabs */}
          <Allotment.Pane minSize={300}>
            <BuilderPane
              projectId={projectId}
              project={project}
              onProjectUpdate={handleProjectUpdate}
              onStartBuild={handleStartBuild}
              isBuilding={isBuilding}
            />
          </Allotment.Pane>

          {/* Right: Live Preview */}
          {showPreview && (
            <Allotment.Pane minSize={300}>
              <LivePreviewPane 
                projectId={projectId}
                previewUrl={previewUrl || undefined}
              />
            </Allotment.Pane>
          )}
        </Allotment>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showComponentLibrary && (
          <ComponentLibrary onClose={() => setShowComponentLibrary(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVersionHistory && (
          <VersionHistory 
            projectId={projectId}
            onClose={() => setShowVersionHistory(false)}
          />
        )}
      </AnimatePresence>

      {/* Voice Controller */}
      <VoiceController projectId={projectId} />
    </div>
  );
}
