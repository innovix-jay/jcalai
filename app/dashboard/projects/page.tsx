'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { scaffoldingEngine } from '@/lib/ai/scaffolding-engine';
import {
  Plus,
  Sparkles,
  Folder,
  Clock,
  Eye,
  MoreVertical,
  Trash,
  Edit,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const createBlankProject = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error('You must be logged in to create a project');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: 'New Project',
          description: 'A new application',
          app_type: 'web',
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Project created!');
      router.push(`/builder/${data.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };

  const createWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please describe your app idea');
      return;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error('You must be logged in to create a project');
      return;
    }

    setAiGenerating(true);

    try {
      // Generate scaffold using AI
      const scaffold = await scaffoldingEngine.generateScaffold(aiPrompt);

      // Create project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: scaffold.projectInfo.name,
          description: scaffold.projectInfo.description,
          app_type: scaffold.projectInfo.appType,
          status: 'draft',
          config: scaffold.config,
          ai_prompt: aiPrompt,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Create pages
      if (scaffold.pages && scaffold.pages.length > 0) {
        const pagesData = scaffold.pages.map((page, index) => ({
          project_id: project.id,
          name: page.name,
          slug: page.slug,
          path: page.path,
          is_protected: page.isProtected,
          structure: page.structure,
          order_index: index,
          is_home: index === 0,
        }));

        const { error: pagesError } = await supabase
          .from('pages')
          .insert(pagesData);

        if (pagesError) throw pagesError;
      }

      // Create database schema if provided
      if (scaffold.databaseSchema) {
        const { error: schemaError } = await supabase
          .from('database_schemas')
          .insert({
            project_id: project.id,
            name: 'Generated Schema',
            tables: scaffold.databaseSchema.tables,
          });

        if (schemaError) throw schemaError;
      }

      // Create API endpoints if provided
      if (scaffold.apiEndpoints && scaffold.apiEndpoints.length > 0) {
        const endpointsData = scaffold.apiEndpoints.map((endpoint) => ({
          project_id: project.id,
          name: endpoint.name,
          path: endpoint.path,
          method: endpoint.method,
          description: endpoint.description,
        }));

        const { error: endpointsError } = await supabase
          .from('api_endpoints')
          .insert(endpointsData);

        if (endpointsError) throw endpointsError;
      }

      toast.success('Project generated successfully!');
      router.push(`/builder/${project.id}`);
    } catch (error) {
      console.error('Error generating project:', error);
      toast.error('Failed to generate project. Please try again.');
    } finally {
      setAiGenerating(false);
      setShowAIModal(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast.success('Project deleted');
      loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600 mt-1">Create and manage your applications</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </Button>
              <Button
                onClick={() => setShowAIModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Create with AI
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">Create your first project to get started</p>
            <div className="flex items-center justify-center space-x-3">
              <Button variant="outline" onClick={createBlankProject}>
                <Plus className="w-5 h-5 mr-2" />
                Blank Project
              </Button>
              <Button
                onClick={() => setShowAIModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Create with AI
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Folder className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{project.name}</h3>
                    <div className="relative group">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button
                          onClick={() => router.push(`/builder/${project.id}`)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center"
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(project.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {project.app_type}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => router.push(`/builder/${project.id}`)}
                      className="w-full"
                      size="sm"
                    >
                      Open Builder
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* AI Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Create with AI</h2>
                  <p className="text-sm text-gray-600">Describe your app and let AI build it</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your app
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Example: Build a modern task management app with team collaboration, time tracking, and project boards. Include user authentication, email notifications, and a clean dashboard with analytics. Use a blue and white color scheme."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={6}
                disabled={aiGenerating}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Tips for better results:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be specific about features and functionality</li>
                <li>• Mention your target users and use cases</li>
                <li>• Describe the design style and color scheme</li>
                <li>• Include any integrations you need (payments, email, etc.)</li>
              </ul>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAIModal(false)} disabled={aiGenerating}>
                Cancel
              </Button>
              <Button
                onClick={createWithAI}
                disabled={aiGenerating || !aiPrompt.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {aiGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Project
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


