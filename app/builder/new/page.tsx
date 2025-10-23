'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { JCALLogo } from '@/components/ui/jcal-logo';
import { Sparkles, ArrowRight, Code, Database, Rocket } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function CreateAppPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateApp = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe your app idea');
      return;
    }

    if (!user) {
      toast.error('Please log in to create an app');
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    
    try {
      // Create the project in the database
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([
          {
            name: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
            description: prompt,
            user_id: user.id,
            status: 'draft',
            framework: 'nextjs',
            ai_prompt: prompt,
          }
        ])
        .select()
        .single();

      if (projectError) throw projectError;

      // Create a default home page for the project
      const { error: pageError } = await supabase
        .from('pages')
        .insert([
          {
            project_id: project.id,
            title: 'Home',
            slug: 'home',
            order_index: 0,
            content: JSON.stringify({
              components: []
            })
          }
        ]);

      if (pageError) throw pageError;

      toast.success('App created! Redirecting to builder...');
      
      // Redirect to builder with the new project
      router.push(`/builder/${project.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create app. Please try again.');
      console.error('App creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const examplePrompts = [
    "Create a task management app with user authentication and real-time updates",
    "Build an e-commerce store with product catalog, shopping cart, and payment processing",
    "Make a social media platform with posts, comments, and user profiles",
    "Create a blog platform with article management and commenting system",
    "Build a fitness tracking app with workout logging and progress charts"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <JCALLogo size="lg" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Create Your App</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Describe your app idea in natural language, and our AI will generate the complete structure, 
            including pages, components, database schema, and deployment configuration.
          </p>
        </div>

        {/* Main Creation Form */}
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <span>Describe Your App</span>
              </CardTitle>
              <CardDescription>
                Be as detailed as possible. Include features, user roles, data requirements, and any specific functionality you want.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Example: Create a task management app with user authentication, project organization, real-time collaboration, file attachments, and mobile-responsive design..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[200px] mb-4"
              />
              <Button 
                onClick={handleCreateApp} 
                disabled={loading || !prompt.trim()}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Your App...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create App with AI
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Example Prompts */}
          <Card>
            <CardHeader>
              <CardTitle>Need Inspiration?</CardTitle>
              <CardDescription>
                Here are some example prompts to get you started:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {examplePrompts.map((example, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setPrompt(example)}
                  >
                    <p className="text-sm text-gray-700">{example}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Code className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">AI Code Generation</h3>
                <p className="text-sm text-gray-600">
                  Complete React components, API routes, and database schemas generated automatically
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Database className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Smart Database</h3>
                <p className="text-sm text-gray-600">
                  Automatic Supabase setup with tables, relationships, and authentication
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Rocket className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">One-Click Deploy</h3>
                <p className="text-sm text-gray-600">
                  Deploy to Vercel with custom domain, SSL, and CDN automatically configured
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
