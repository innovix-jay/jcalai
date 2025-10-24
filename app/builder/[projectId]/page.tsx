'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AnimatePresence } from 'framer-motion';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { AIAssistantPanel } from '@/components/builder/AIAssistantPanel';
import { EmptyState } from '@/components/builder/EmptyState';
import { PlanSummaryCard } from '@/components/builder/PlanSummaryCard';
import { BuildProgress } from '@/components/builder/BuildProgress';
import { BuilderToolbar } from '@/components/builder/BuilderToolbar';
import { BuilderCanvas } from '@/components/builder/BuilderCanvas';
import { LivePreviewPane } from '@/components/builder/LivePreviewPane';
import { BuildProgressPanel } from '@/components/builder/BuildProgressPanel';
import { ComponentInspector } from '@/components/builder/ComponentInspector';
import { NaturalLanguageInput } from '@/components/builder/NaturalLanguageInput';
import { DeployButton } from '@/components/builder/DeployButton';
import { ComponentLibrary } from '@/components/builder/ComponentLibrary';
import { VersionHistory } from '@/components/builder/VersionHistory';
import { VoiceController } from '@/components/builder/VoiceController';
import { aiOnboardingService } from '@/services/ai-onboarding-service';
import type { AIProvider } from '@/lib/ai/model-router';
import type { ProjectPlan } from '@/types/onboarding';
import toast from 'react-hot-toast';
import { Sparkles } from 'lucide-react';

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;
  
  const [project, setProject] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // AI Onboarding state
  const [isNewProject, setIsNewProject] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showPlanSummary, setShowPlanSummary] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<ProjectPlan | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [currentBuildStep, setCurrentBuildStep] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIProvider>('auto');

  // Split-screen layout state
  const [showPreview, setShowPreview] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Feature state
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

      // Check if it's a new project (no pages yet)
      const newProject = pagesData === null || pagesData.length === 0;
      setIsNewProject(newProject);
      if (newProject) {
        setShowAIPanel(true); // Auto-expand AI panel for new projects
      }

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

  // Handle plan ready from AI Assistant
  const handlePlanReady = (plan: ProjectPlan) => {
    setCurrentPlan(plan);
    setShowPlanSummary(true);
    setShowAIPanel(false); // Hide AI panel to show plan summary
  };

  // Handle plan confirmation
  const handleConfirmPlan = async () => {
    if (!currentPlan) return;

    setIsBuilding(true);
    setShowPlanSummary(false);
    setShowAIPanel(false); // Hide AI panel during build
    setBuildProgress(0);
    setCurrentBuildStep('Initializing build...');

    try {
      // Simulate build process
      const steps = [
        'Setting up project structure',
        'Generating core pages',
        'Creating essential components',
        'Configuring database schema',
        'Implementing authentication',
        'Finalizing deployment setup',
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentBuildStep(steps[i]);
        setBuildProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate work
      }

      // TODO: Call actual AI generation service here
      // For now, just simulate success
      toast.success('Project built successfully!');
      setIsBuilding(false);
      setBuildProgress(100);
      setCurrentBuildStep('Build Complete!');
      loadProject(); // Reload project to show new pages/components
    } catch (error: any) {
      console.error('Build error:', error);
      toast.error(error.message || 'Build failed. Please try again.');
      setIsBuilding(false);
    }
  };

  // Handle modify plan
  const handleModifyPlan = () => {
    setShowPlanSummary(false);
    setShowAIPanel(true);
    toast('Let\'s refine your plan...', { icon: '💡' });
  };

  // Handle build complete
  const handleBuildComplete = () => {
    setIsBuilding(false);
    setBuildProgress(0);
    setCurrentBuildStep('');
  };

  // Handle quick start prompt selection
  const handlePromptSelect = async (prompt: string) => {
    setShowAIPanel(true);
    
    // Initialize conversation with the prompt
    try {
      await aiOnboardingService.initiateProject(
        projectId,
        project.name,
        prompt,
        selectedModel // Pass selectedModel
      );
    } catch (error) {
      console.error('Failed to start conversation:', error);
      toast.error('Failed to start conversation');
    }
  };

  // Handle start build from toolbar
  const handleStartBuild = () => {
    if (isNewProject) {
      setShowAIPanel(true);
    } else {
      // Start building existing project
      setIsBuilding(true);
      setBuildProgress(0);
      setCurrentBuildStep('Starting build...');
    }
  };

  // Handle stop build from toolbar
  const handleStopBuild = () => {
    setIsBuilding(false);
    setBuildProgress(0);
    setCurrentBuildStep('');
  };

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
    <div className="h-screen flex flex-col bg-gray-50 relative overflow-hidden">
      {/* Top Toolbar */}
      <BuilderToolbar 
        projectId={projectId}
        projectName={project.name}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
        onStartBuild={handleStartBuild}
        onStopBuild={handleStopBuild}
        isBuilding={isBuilding}
        onShowComponentLibrary={() => setShowComponentLibrary(true)}
        onShowVersionHistory={() => setShowVersionHistory(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {isNewProject ? (
          <EmptyState onPromptSelect={handlePromptSelect} />
        ) : (
          <Allotment defaultSizes={[50, 50]}>
            {/* Left: Canvas/Components Panel */}
            <Allotment.Pane minSize={300}>
              <BuilderCanvas 
                projectId={projectId}
                isBuilding={isBuilding}
                buildProgress={buildProgress}
              />
            </Allotment.Pane>

            {/* Right: Live Preview */}
            {showPreview && (
              <Allotment.Pane minSize={300}>
                <LivePreviewPane 
                  projectId={projectId}
                  url={previewUrl}
                />
              </Allotment.Pane>
            )}
          </Allotment>
        )}

        {/* AI Assistant - Floating Right Panel */}
        <AnimatePresence>
          {showAIPanel && (
            <AIAssistantPanel
              projectId={projectId}
              projectName={project.name}
              initialPrompt={project.ai_prompt || project.description || ''}
              isNew={isNewProject}
              selectedModel={selectedModel}
              onClose={() => setShowAIPanel(false)}
              onPlanReady={handlePlanReady}
              onBuildStart={() => {}}
            />
          )}
        </AnimatePresence>

        {/* Plan Summary Modal */}
        <AnimatePresence>
          {showPlanSummary && currentPlan && (
            <PlanSummaryCard
              plan={currentPlan}
              onConfirm={handleConfirmPlan}
              onModify={handleModifyPlan}
            />
          )}
        </AnimatePresence>

        {/* Build Progress Indicator */}
        <AnimatePresence>
          {isBuilding && (
            <BuildProgress
              isVisible={isBuilding}
              currentStep={currentBuildStep}
              progress={buildProgress}
              onComplete={handleBuildComplete}
            />
          )}
        </AnimatePresence>

        {/* Build Progress Panel */}
        <BuildProgressPanel projectId={projectId} />

        {/* Component Inspector */}
        <ComponentInspector projectId={projectId} />

        {/* Natural Language Input */}
        <NaturalLanguageInput projectId={projectId} />

        {/* Component Library Modal */}
        <AnimatePresence>
          {showComponentLibrary && (
            <ComponentLibrary 
              projectId={projectId}
              onClose={() => setShowComponentLibrary(false)}
            />
          )}
        </AnimatePresence>

        {/* Version History Modal */}
        <AnimatePresence>
          {showVersionHistory && (
            <VersionHistory 
              projectId={projectId}
              onClose={() => setShowVersionHistory(false)}
            />
          )}
        </AnimatePresence>

        {/* Voice Controller - Fixed Position */}
        <VoiceController projectId={projectId} />
      </div>
    </div>
  );
}