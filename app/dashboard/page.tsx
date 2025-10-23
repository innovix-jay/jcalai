'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { useProjectSync } from '@/lib/hooks/use-project-sync';
import { JCALLogo } from '@/components/ui/jcal-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Code, 
  Rocket, 
  Database, 
  ArrowRight, 
  Sparkles, 
  Zap,
  Folder,
  Play,
  Settings,
  BarChart3
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { projects, loading: projectsLoading } = useProjectSync(user?.id || '');
  const [stats, setStats] = useState({
    total: 0,
    deployed: 0,
    templatesUsed: 0
  });

  useEffect(() => {
    if (projects) {
      setStats({
        total: projects.length,
        deployed: projects.filter(p => p.status === 'published').length,
        templatesUsed: projects.filter(p => p.ai_metadata?.template_id).length
      });
    }
  }, [projects]);

  if (authLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
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
            <Button className="w-full" onClick={() => router.push('/auth/login')}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold mb-3">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome to JCAL.ai, {user.email?.split('@')[0]}!
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Your AI-powered no-code app building workspace
              </p>
            </div>
            <div className="hidden md:block">
              <JCALLogo size="xl" />
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickActionCard
              icon={<Plus className="w-6 h-6" />}
              title="Create New App"
              description="Start building with AI"
              onClick={() => router.push('/builder/new')}
              gradient="from-indigo-500 to-purple-600"
            />
            <QuickActionCard
              icon={<Code className="w-6 h-6" />}
              title="Browse Templates"
              description="Start from templates"
              onClick={() => router.push('/templates')}
              gradient="from-purple-500 to-pink-600"
            />
            <QuickActionCard
              icon={<Database className="w-6 h-6" />}
              title="Learn & Docs"
              description="Get started guide"
              onClick={() => router.push('/docs')}
              gradient="from-pink-500 to-red-600"
            />
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Your Workspace
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              label="Projects"
              value={stats.total}
              subtext="Apps created"
              icon={<Folder className="w-6 h-6" />}
              gradient="from-blue-500 to-cyan-500"
            />
            <StatsCard
              label="Deployed"
              value={stats.deployed}
              subtext="Live applications"
              icon={<Rocket className="w-6 h-6" />}
              gradient="from-green-500 to-emerald-500"
            />
            <StatsCard
              label="Templates Used"
              value={stats.templatesUsed}
              subtext="Templates utilized"
              icon={<Sparkles className="w-6 h-6" />}
              gradient="from-orange-500 to-amber-500"
            />
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recent Projects
            </h2>
            <button 
              onClick={() => router.push('/dashboard/projects')}
              className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {projects.length === 0 ? (
            <EmptyProjectsState onCreateNew={() => router.push('/builder/new')} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function QuickActionCard({ icon, title, description, onClick, gradient }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm 
                 rounded-2xl border border-gray-200/50 dark:border-gray-800/50
                 shadow-lg hover:shadow-xl transition-all text-left group"
    >
      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl 
                      flex items-center justify-center text-white mb-4
                      group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 
                     group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </motion.button>
  );
}

function StatsCard({ label, value, subtext, icon, gradient }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm 
                 rounded-2xl border border-gray-200/50 dark:border-gray-800/50
                 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl 
                        flex items-center justify-center text-white`}>
          {icon}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {label}
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-4xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {subtext}
        </p>
      </div>
    </motion.div>
  );
}

function EmptyProjectsState({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-12 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm 
                 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700
                 text-center"
    >
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 
                      rounded-full flex items-center justify-center text-5xl">
        🚀
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Ready to Build Something Amazing?
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        You haven't created any projects yet. Start by creating your first app with our AI assistant!
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCreateNew}
        className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 
                   text-white rounded-2xl font-semibold text-lg shadow-lg 
                   hover:shadow-xl transition-all"
      >
        Create Your First App ✨
      </motion.button>
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: any; index: number }) {
  const router = useRouter();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => router.push(`/builder/${project.id}`)}
      className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm 
                 rounded-2xl border border-gray-200/50 dark:border-gray-800/50
                 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 
                         group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {project.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {project.description || 'No description available'}
          </p>
        </div>
        <div className={`w-3 h-3 rounded-full ${
          project.build_status === 'completed' ? 'bg-green-500' :
          project.build_status === 'in-progress' ? 'bg-yellow-500' :
          'bg-gray-400'
        }`} />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
          <span className="capitalize">{project.status}</span>
          <span>•</span>
          <span>{new Date(project.created_at).toLocaleDateString()}</span>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
      </div>
    </motion.div>
  );
}