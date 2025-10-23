'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JCALLogo } from '@/components/ui/jcal-logo';
import { 
  Sparkles, 
  ShoppingCart, 
  MessageSquare, 
  Calendar, 
  FileText,
  Users,
  BarChart,
  Briefcase,
  Heart,
  Camera,
  Music,
  Dumbbell,
  GraduationCap,
  Home
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  features: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
}

export default function TemplatesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [creatingFromTemplate, setCreatingFromTemplate] = useState<string | null>(null);

  const templates: Template[] = [
    {
      id: 'ecommerce',
      name: 'E-Commerce Store',
      description: 'Complete online store with product catalog, shopping cart, and payment processing',
      icon: ShoppingCart,
      category: 'business',
      features: ['Product Management', 'Shopping Cart', 'Payment Integration', 'Order Tracking'],
      complexity: 'intermediate'
    },
    {
      id: 'blog',
      name: 'Blog Platform',
      description: 'Modern blog with article management, comments, and user profiles',
      icon: FileText,
      category: 'content',
      features: ['Article Editor', 'Comments', 'Categories', 'SEO Optimization'],
      complexity: 'beginner'
    },
    {
      id: 'social',
      name: 'Social Network',
      description: 'Social platform with posts, comments, likes, and user connections',
      icon: MessageSquare,
      category: 'social',
      features: ['User Profiles', 'Posts & Comments', 'Real-time Notifications', 'Friend System'],
      complexity: 'advanced'
    },
    {
      id: 'saas',
      name: 'SaaS Dashboard',
      description: 'Professional SaaS application with subscription management and analytics',
      icon: BarChart,
      category: 'business',
      features: ['User Dashboard', 'Subscription Plans', 'Analytics', 'Team Management'],
      complexity: 'advanced'
    },
    {
      id: 'portfolio',
      name: 'Portfolio Website',
      description: 'Showcase your work with a beautiful portfolio site',
      icon: Briefcase,
      category: 'personal',
      features: ['Project Gallery', 'About Section', 'Contact Form', 'Responsive Design'],
      complexity: 'beginner'
    },
    {
      id: 'booking',
      name: 'Booking System',
      description: 'Appointment scheduling and booking management system',
      icon: Calendar,
      category: 'business',
      features: ['Calendar View', 'Booking Management', 'Email Notifications', 'Payment Integration'],
      complexity: 'intermediate'
    },
    {
      id: 'fitness',
      name: 'Fitness Tracker',
      description: 'Track workouts, nutrition, and fitness progress',
      icon: Dumbbell,
      category: 'health',
      features: ['Workout Logging', 'Progress Charts', 'Meal Planning', 'Goals Tracking'],
      complexity: 'intermediate'
    },
    {
      id: 'learning',
      name: 'Learning Platform',
      description: 'Online course platform with video lessons and quizzes',
      icon: GraduationCap,
      category: 'education',
      features: ['Course Management', 'Video Lessons', 'Quizzes', 'Student Progress'],
      complexity: 'advanced'
    },
  ];

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'business', name: 'Business' },
    { id: 'social', name: 'Social' },
    { id: 'content', name: 'Content' },
    { id: 'personal', name: 'Personal' },
    { id: 'health', name: 'Health' },
    { id: 'education', name: 'Education' },
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleUseTemplate = async (template: Template) => {
    if (!user) {
      toast.error('Please log in to use templates');
      router.push('/auth/login');
      return;
    }

    setCreatingFromTemplate(template.id);
    const supabase = createClient();

    try {
      // Create project from template
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([
          {
            name: template.name,
            description: template.description,
            user_id: user.id,
            status: 'draft',
            framework: 'nextjs',
            template_id: template.id,
          }
        ])
        .select()
        .single();

      if (projectError) throw projectError;

      // Create default page
      const { error: pageError } = await supabase
        .from('pages')
        .insert([
          {
            project_id: project.id,
            title: 'Home',
            slug: 'home',
            order_index: 0,
            content: JSON.stringify({ components: [] })
          }
        ]);

      if (pageError) throw pageError;

      toast.success(`Created ${template.name}! Redirecting to builder...`);
      router.push(`/builder/${project.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create project from template');
      console.error('Template creation error:', error);
    } finally {
      setCreatingFromTemplate(null);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <JCALLogo size="md" />
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/builder/new">
                <Button>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create from Scratch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">App Templates</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with a professionally designed template and customize it to your needs
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <Badge className={getComplexityColor(template.complexity)}>
                      {template.complexity}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Features:</h4>
                      <ul className="space-y-1">
                        {template.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleUseTemplate(template)}
                      disabled={creatingFromTemplate === template.id}
                    >
                      {creatingFromTemplate === template.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Use This Template
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No templates found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}

