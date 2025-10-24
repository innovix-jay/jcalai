'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { JCALLogo } from '@/components/ui/jcal-logo';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Eye, 
  MessageSquare, 
  Rocket, 
  Bug, 
  Grid3x3, 
  Download, 
  History,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Hot Reload System",
      description: "See changes in <1 second. Faster than any competitor.",
      highlight: "Faster than Bolt",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Visual Component Inspector",
      description: "Alt+Click any element. Edit styles visually. See instant updates.",
      highlight: "Unique to JCAL.ai",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Natural Language Editing",
      description: "Press Cmd+K, type 'make header sticky', done. Smoother than Lovable.",
      highlight: "Smoothest in market",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "One-Click Vercel Deploy",
      description: "Deploy to production in 60 seconds. Professional hosting.",
      highlight: "Better than Replit",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: <Bug className="w-6 h-6" />,
      title: "AI Code Fixer",
      description: "Errors fix themselves automatically. AI-powered debugging.",
      highlight: "Only on JCAL.ai",
      gradient: "from-red-500 to-pink-600"
    },
    {
      icon: <Grid3x3 className="w-6 h-6" />,
      title: "Component Library",
      description: "10+ pre-built components. Drag, drop, customize.",
      highlight: "Production-ready",
      gradient: "from-purple-500 to-fuchsia-600"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Code Export",
      description: "Download complete Next.js project. Deploy anywhere. Own your code.",
      highlight: "Full ownership",
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      icon: <History className="w-6 h-6" />,
      title: "Version History",
      description: "Time-travel through changes. Restore any version. Git-like control.",
      highlight: "Undo anything",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const comparisons = [
    { name: "Bolt.new", score: "3/8", color: "text-yellow-600" },
    { name: "Lovable.dev", score: "2/8", color: "text-orange-600" },
    { name: "Replit", score: "2/8", color: "text-red-600" },
    { name: "v0.dev", score: "1/8", color: "text-red-700" },
    { name: "JCAL.ai", score: "8/8", color: "text-green-600 font-bold" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <div className="flex justify-center mb-6">
              <JCALLogo size="xl" />
            </div>
            
            <h1 className="text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                8 Features That Make
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Competitors Irrelevant
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              JCAL.ai is now <strong>clearly superior</strong> to Bolt, Lovable, Replit, and v0
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Start Building Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl
                           border border-gray-200/50 dark:border-gray-800/50 hover:shadow-xl transition-all"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl 
                                flex items-center justify-center text-white mb-4`}>
                  {feature.icon}
                </div>
                
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {feature.description}
                </p>
                
                <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 
                                text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                  {feature.highlight}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8
                       border border-gray-200/50 dark:border-gray-800/50 shadow-xl"
          >
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              How JCAL.ai Compares
            </h2>
            
            <div className="grid grid-cols-5 gap-4 text-center">
              <div className="font-semibold text-gray-600 dark:text-gray-400">Platform</div>
              <div className="font-semibold text-gray-600 dark:text-gray-400">Features</div>
              <div className="font-semibold text-gray-600 dark:text-gray-400">Speed</div>
              <div className="font-semibold text-gray-600 dark:text-gray-400">Deploy</div>
              <div className="font-semibold text-gray-600 dark:text-gray-400">Export</div>

              {comparisons.map((comp, index) => (
                <>
                  <div key={`${comp.name}-name`} className={`py-3 ${comp.name === 'JCAL.ai' ? 'font-bold' : ''}`}>
                    {comp.name}
                  </div>
                  <div key={`${comp.name}-score`} className={comp.color}>
                    {comp.score}
                  </div>
                  <div key={`${comp.name}-speed`}>
                    {comp.name === 'JCAL.ai' ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : '—'}
                  </div>
                  <div key={`${comp.name}-deploy`}>
                    {comp.name === 'JCAL.ai' ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : '—'}
                  </div>
                  <div key={`${comp.name}-export`}>
                    {comp.name === 'JCAL.ai' || comp.name === 'Replit' ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : '—'}
                  </div>
                </>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🏆 JCAL.ai: <span className="text-green-600">8/8 Features</span> vs Competitors: <span className="text-red-600">1-3/8</span>
              </p>
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Try JCAL.ai Free →
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
