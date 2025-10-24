'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BuilderWorkspace } from '@/components/builder/workspace';
import { BuilderSidebar } from '@/components/builder/sidebar';
import { BuilderToolbar } from '@/components/builder/toolbar';
import { AIPromptPanel } from '@/components/builder/ai-prompt-panel';
import { PreviewPanel } from '@/components/builder/preview-panel';
import { BackendPanel } from '@/components/builder/backend-panel';

export default function BuilderPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [project, setProject] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'backend'>('preview');
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [selectedModel, setSelectedModel] = useState<'auto' | 'claude' | 'openai' | 'gemini'>('auto');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const loadProject = useCallback(async () => {
    const supabase = createClient();
    
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
      
      if (pagesData && pagesData.length > 0) {
        setCurrentPage(pagesData[0]);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
      {/* Toolbar */}
      <BuilderToolbar
        project={project}
        currentPage={currentPage}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        showAIPanel={showAIPanel}
        setShowAIPanel={setShowAIPanel}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Component Library */}
        <BuilderSidebar project={project} />

        {/* Center - Main Work Area */}
        <div className="flex-1 flex flex-col">
          {/* AI Prompt Panel */}
          {showAIPanel && (
            <AIPromptPanel
              projectId={projectId}
              selectedModel={selectedModel}
              onClose={() => setShowAIPanel(false)}
              onGenerate={(result) => {
                // Handle AI generation result
                console.log('AI generated:', result);
                loadProject(); // Reload project to see changes
              }}
            />
          )}

          {/* Preview or Backend Panel */}
          <div className="flex-1 overflow-hidden">
            {viewMode === 'preview' ? (
              <PreviewPanel
                project={project}
                currentPage={currentPage}
              />
            ) : (
              <BackendPanel
                project={project}
              />
            )}
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Properties</h3>
            {/* Properties panel content */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  value={currentPage?.title || ''}
                  onChange={(e) => {
                    // Update page title
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={currentPage?.description || ''}
                  onChange={(e) => {
                    // Update page description
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


