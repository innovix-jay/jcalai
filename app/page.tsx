'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { JCALLogo } from '@/components/ui/jcal-logo';
import { useAuth } from '@/lib/hooks/use-auth';
import {
  Sparkles,
  Zap,
  Code,
  Database,
  Rocket,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
} from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <JCALLogo size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render homepage if user is logged in (will redirect)
  if (user) {
    return null;
  }

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Scaffolding',
      description: 'Describe your app in natural language and watch AI generate the complete structure, pages, components, and database schema.',
    },
    {
      icon: Code,
      title: 'Visual Drag & Drop Builder',
      description: 'Intuitive visual editor powered by Craft.js. Build beautiful UIs without writing code, with real-time preview.',
    },
    {
      icon: Database,
      title: 'Smart Database Designer',
      description: 'Visual database schema builder with automatic SQL generation. Design complex relationships with ease.',
    },
    {
      icon: Zap,
      title: 'Intelligent Model Router',
      description: 'Automatically selects the best AI model (Claude, GPT-4, or Gemini) based on your task for optimal results and cost.',
    },
    {
      icon: Rocket,
      title: 'One-Click Deployment',
      description: 'Deploy to Vercel, Netlify, or AWS with a single click. Custom domains, SSL, and CDN included.',
    },
    {
      icon: Users,
      title: 'Real-Time Collaboration',
      description: 'Work together with your team in real-time. Share projects, assign roles, and track changes.',
    },
  ];

  const competitors = [
    { name: 'Replit', why: 'Faster scaffolding, visual-first approach, smarter AI' },
    { name: 'Lovable', why: 'More powerful backend, full code ownership, extensible' },
    { name: 'Bolt', why: 'Advanced AI routing, better architecture, built-in integrations' },
    { name: 'Cursor', why: 'No coding required, visual building, more accessible' },
    { name: 'Base44', why: 'AI-powered scaffolding, open source code, scalable' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <JCALLogo size="md" />
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900">
                Docs
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>The Future of No-Code Development</span>
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Build Production Apps
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                In Minutes, Not Months
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              JCAL.ai by Innovix Dynamix is the ultimate AI-powered no-code platform. Describe your app idea and watch 
              as intelligent AI scaffolds your complete application—from UI to database to deployment.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Building Free
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Watch Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Free plan available • Export your code
            </p>
          </div>

          {/* Screenshot/Preview */}
          <div className="mt-20">
            <div className="relative rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 h-96 flex items-center justify-center">
                <div className="text-white text-center">
                  <Code className="w-24 h-24 mx-auto mb-4 opacity-50" />
                  <p className="text-2xl font-semibold">Builder Interface Preview</p>
                  <p className="text-blue-100 mt-2">Screenshot coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Build Amazing Apps
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features that rival and surpass the competition
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why JCAL.ai Beats the Competition
            </h2>
            <p className="text-xl text-gray-600">
              We've taken the best from every platform and made it better
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitors.map((competitor) => (
              <div key={competitor.name} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Star className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">vs {competitor.name}</h3>
                </div>
                <p className="text-gray-700">{competitor.why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  3 projects
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  AI generations (limited)
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Community support
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Code export
                </li>
              </ul>
              <Link href="/auth/signup">
                <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 border-2 border-blue-600 relative transform scale-105">
              <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$29</span>
                <span className="text-blue-100">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mr-2" />
                  Unlimited projects
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mr-2" />
                  Unlimited AI generations
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mr-2" />
                  Priority support
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mr-2" />
                  Custom domains
                </li>
                <li className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mr-2" />
                  Team collaboration
                </li>
              </ul>
              <Link href="/auth/signup">
                <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100">
                  Start Pro Trial
                </button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Everything in Pro
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Dedicated support
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  SLA guarantees
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Custom integrations
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  On-premise options
                </li>
              </ul>
              <Link href="mailto:enterprise@jcalai.com">
                <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800">
                  Contact Sales
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build the Future?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of creators building amazing applications with JCAL.ai.
            Start for free, no credit card required.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Building Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <JCALLogo size="md" />
              <p className="text-gray-400">
                JCAL.ai by Innovix Dynamix - The ultimate AI-powered no-code platform for building production applications.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Innovix Dynamix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
