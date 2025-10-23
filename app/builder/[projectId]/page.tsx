'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AnimatePresence } from 'framer-motion';
import { AIAssistantPanel } from '@/components/builder/AIAssistantPanel';
import { EmptyState } from '@/components/builder/EmptyState';
import { PlanSummaryCard } from '@/components/builder/PlanSummaryCard';
import { BuildProgress } from '@/components/builder/BuildProgress';
import { projectOnboardingService } from '@/services/project-onboarding';
import type { ProjectPlan } from '@/types/onboarding';
import toast from 'react-hot-toast';
import { Sparkles } from 'lucide-react';

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  
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

  // Load project data
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
      setPages(pagesData || []);

      // Check if this is a new project (no pages or minimal content)
      const isEmpty = !pagesData || pagesData.length === 0 || 
        (pagesData.length === 1 && !pagesData[0].structure?.ROOT?.nodes?.length);
      
      setIsNewProject(isEmpty);
      
      // Auto-open AI panel for new projects
      if (isEmpty) {
        setShowAIPanel(true);
      }

    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  // Handle plan ready from AI
  const handlePlanReady = (plan: ProjectPlan) => {
    setCurrentPlan(plan);
    setShowPlanSummary(true);
  };

  // Handle build confirmation
  const handleConfirmBuild = async () => {
    if (!currentPlan) return;

    setIsBuilding(true);
    setShowPlanSummary(false);
    setBuildProgress(0);

    try {
      // Simulate build process with steps
      const buildSteps = [
        { step: 'setup', progress: 20, delay: 2000 },
        { step: 'pages', progress: 40, delay: 3000 },
        { step: 'components', progress: 60, delay: 2500 },
        { step: 'database', progress: 80, delay: 2000 },
        { step: 'finalize', progress: 100, delay: 1500 },
      ];

      for (const { step, progress, delay } of buildSteps) {
        setCurrentBuildStep(step);
        setBuildProgress(progress);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Actually generate the pages
      const supabase = createClient();
      
      for (const page of currentPlan.pages) {
        const { error } = await supabase
          .from('pages')
          .insert({
            project_id: projectId,
            name: page.name,
            title: page.name,
            slug: page.name.toLowerCase().replace(/\s+/g, '-'),
            path: `/${page.name.toLowerCase().replace(/\s+/g, '-')}`,
            is_home: page.name === 'Home',
            order_index: currentPlan.pages.indexOf(page),
            structure: {
              ROOT: {
                type: 'Container',
                nodes: [],
                props: {
                  className: 'min-h-screen p-8',
                }
              }
            },
            description: page.purpose,
          });

        if (error) throw error;
      }

      // Mark project as initialized
      await supabase
        .from('projects')
        .update({ 
          status: 'active',
          ai_metadata: {
            ...project.ai_metadata,
            onboarding_complete: true,
            plan: currentPlan,
          }
        })
        .eq('id', projectId);

      toast.success('Project built successfully! 🎉');
      
      // Reload project
      await loadProject();
      setIsNewProject(false);

    } catch (error: any) {
      console.error('Build failed:', error);
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
      await projectOnboardingService.initiateProject(
        projectId,
        project.name,
        prompt
      );
    } catch (error) {
      console.error('Failed to start conversation:', error);
      toast.error('Failed to start conversation');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
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
    <div className="h-screen flex flex-col bg-gray-50 relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <div className="w-px h-6 bg-gray-300" />
            <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
            {isNewProject && (
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                New Project
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all
                ${showAIPanel 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              AI Assistant
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {isNewProject ? (
          <EmptyState onPromptSelect={handlePromptSelect} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your project is ready to build! 🚀
              </h2>
              <p className="text-gray-600 mb-8">
                You have {pages.length} page{pages.length !== 1 ? 's' : ''} ready to customize
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className="p-6 bg-white rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors cursor-pointer"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{page.name}</h3>
                    <p className="text-sm text-gray-600">{page.description || 'No description'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Assistant Panel (slides in from right) */}
        <AnimatePresence>
          {showAIPanel && (
            <AIAssistantPanel
              projectId={projectId}
              projectName={project.name}
              initialPrompt={project.ai_prompt || project.description || ''}
              isNew={isNewProject}
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
              onConfirm={handleConfirmBuild}
              onModify={handleModifyPlan}
              onClose={() => setShowPlanSummary(false)}
              isBuilding={isBuilding}
            />
          )}
        </AnimatePresence>

        {/* Build Progress */}
        <BuildProgress
          isVisible={isBuilding || buildProgress > 0}
          currentStep={currentBuildStep}
          progress={buildProgress}
          onComplete={handleBuildComplete}
        />
      </div>
    </div>
  );
}
