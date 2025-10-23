'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Rocket, 
  Database,
  ArrowRight,
  Plus,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    deployed: 0,
    templates: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      // TODO: Load actual project data from Supabase
      // For now, show placeholder data
      setStats({
        projects: 0,
        deployed: 0,
        templates: 0,
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Please Sign In</CardTitle>
            <CardDescription>You need to be signed in to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to JCAL.ai, {user.email?.split('@')[0]}!</h1>
        <p className="text-gray-600">Your AI-powered no-code app building workspace</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/builder/new">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Create New App</h3>
                    <p className="text-sm text-gray-600">Start building with AI</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/templates">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Browse Templates</h3>
                    <p className="text-sm text-gray-600">Start from templates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/docs">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Code className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Learn & Docs</h3>
                    <p className="text-sm text-gray-600">Get started guide</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Workspace</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Code className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.projects}</div>
              <p className="text-xs text-gray-600 mt-1">
                Apps created
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deployed</CardTitle>
              <Rocket className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.deployed}</div>
              <p className="text-xs text-gray-600 mt-1">
                Live applications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates Used</CardTitle>
              <Database className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.templates}</div>
              <p className="text-xs text-gray-600 mt-1">
                Templates utilized
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <span>Getting Started</span>
          </CardTitle>
          <CardDescription>
            Ready to build your first app? Here's how to get started with JCAL.ai
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-medium">Describe Your App</h4>
                <p className="text-sm text-gray-600">Tell our AI what kind of app you want to build in natural language</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-medium">AI Generates Structure</h4>
                <p className="text-sm text-gray-600">Our AI creates pages, components, database schema, and API routes</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-medium">Customize & Deploy</h4>
                <p className="text-sm text-gray-600">Use our visual builder to customize and deploy with one click</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/builder/new">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Start Building Your First App
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}