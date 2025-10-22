'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Send, X, Loader2 } from 'lucide-react';
import { scaffoldingEngine } from '@/lib/ai/scaffolding-engine';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface AIPromptPanelProps {
  projectId: string;
  selectedModel: 'auto' | 'claude' | 'openai' | 'gemini';
  onClose: () => void;
  onGenerate: (result: any) => void;
}

export function AIPromptPanel({ projectId, selectedModel, onClose, onGenerate }: AIPromptPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generationType, setGenerationType] = useState<'page' | 'component' | 'database' | 'api'>('page');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      if (generationType === 'page') {
        // Generate a new page
        const result = await scaffoldingEngine.generatePage(
          'New Page',
          prompt,
          `Project ID: ${projectId}`
        );

        // Save to database
        const { data, error } = await supabase
          .from('pages')
          .insert({
            project_id: projectId,
            name: result.name,
            slug: result.slug,
            path: result.path,
            is_protected: result.isProtected,
            structure: result.structure,
            title: result.title,
            description: result.description,
          })
          .select()
          .single();

        if (error) throw error;

        toast.success('Page generated successfully!');
        onGenerate(data);
      } else if (generationType === 'component') {
        // Generate a component
        const result = await scaffoldingEngine.generateComponent(
          'New Component',
          prompt,
          'custom'
        );

        const { data, error } = await supabase
          .from('components')
          .insert({
            project_id: projectId,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            name: result.name,
            component_type: result.type,
            structure: result.structure,
            props_schema: result.propsSchema || {},
          })
          .select()
          .single();

        if (error) throw error;

        toast.success('Component generated successfully!');
        onGenerate(data);
      } else if (generationType === 'database') {
        // Generate database schema
        const result = await scaffoldingEngine.generateDatabaseSchema(
          prompt,
          `Project ID: ${projectId}`
        );

        const { data, error } = await supabase
          .from('database_schemas')
          .insert({
            project_id: projectId,
            name: 'Generated Schema',
            tables: result.tables,
            relationships: result.relationships || [],
          })
          .select()
          .single();

        if (error) throw error;

        toast.success('Database schema generated successfully!');
        onGenerate(data);
      } else if (generationType === 'api') {
        // Generate API endpoints
        const result = await scaffoldingEngine.generateAPIEndpoints(prompt);

        const { data, error } = await supabase
          .from('api_endpoints')
          .insert(
            result.map((endpoint: any) => ({
              project_id: projectId,
              name: endpoint.name,
              path: endpoint.path,
              method: endpoint.method,
              description: endpoint.description,
              config: {
                auth: endpoint.auth || false,
                rateLimit: 100,
              },
            }))
          )
          .select();

        if (error) throw error;

        toast.success(`${result.length} API endpoints generated successfully!`);
        onGenerate(data);
      }

      setPrompt('');
    } catch (error) {
      console.error('Error generating:', error);
      toast.error('Failed to generate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-800">AI Assistant</h2>
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
              {selectedModel === 'auto' ? 'Auto' : selectedModel}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex space-x-2 mb-3">
          {(['page', 'component', 'database', 'api'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setGenerationType(type)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                generationType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex space-x-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleGenerate();
              }
            }}
            placeholder={`Describe the ${generationType} you want to create... (Cmd/Ctrl + Enter to generate)`}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            disabled={loading}
          />
          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          AI will generate a {generationType} based on your description using the {selectedModel} model.
        </p>
      </div>
    </div>
  );
}


