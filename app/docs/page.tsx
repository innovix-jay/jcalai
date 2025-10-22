import Link from 'next/link';
import { Sparkles, Book, Code, Database, Rocket, Settings, FileText } from 'lucide-react';
import { JCALLogo } from '@/components/ui/jcal-logo';

export default function DocsPage() {
  const sections = [
    {
      title: 'Getting Started',
      icon: Rocket,
      docs: [
        { name: 'Quick Start Guide', desc: 'Get up and running in 5 minutes', href: '#quick-start' },
        { name: 'Your First App', desc: 'Create your first application with AI', href: '#first-app' },
        { name: 'Platform Overview', desc: 'Understand the JCAL.ai platform', href: '#overview' },
      ],
    },
    {
      title: 'Building Apps',
      icon: Code,
      docs: [
        { name: 'Visual Builder', desc: 'Use the drag-and-drop interface', href: '#builder' },
        { name: 'AI Assistance', desc: 'Leverage AI to generate features', href: '#ai' },
        { name: 'Component Library', desc: 'Available components and usage', href: '#components' },
      ],
    },
    {
      title: 'Backend & Data',
      icon: Database,
      docs: [
        { name: 'Managed Backend', desc: 'One-click backend provisioning', href: '#managed-backend' },
        { name: 'External Databases', desc: 'Connect your own database', href: '#external-db' },
        { name: 'Database Designer', desc: 'Visual schema management', href: '#db-designer' },
        { name: 'API Builder', desc: 'Create REST endpoints', href: '#api' },
      ],
    },
    {
      title: 'Deployment',
      icon: Rocket,
      docs: [
        { name: 'Deploying to Vercel', desc: 'One-click deployments', href: '#deploy' },
        { name: 'Custom Domains', desc: 'Add your own domain', href: '#domains' },
        { name: 'Environment Variables', desc: 'Managing configurations', href: '#env-vars' },
        { name: 'Code Export', desc: 'Download your source code', href: '#export' },
      ],
    },
    {
      title: 'Advanced',
      icon: Settings,
      docs: [
        { name: 'Templates', desc: 'Using and creating templates', href: '#templates' },
        { name: 'Integrations', desc: 'Connect third-party services', href: '#integrations' },
        { name: 'Collaboration', desc: 'Team features and permissions', href: '#collab' },
        { name: 'API Reference', desc: 'Platform API documentation', href: '#api-ref' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <JCALLogo size="md" />
              <span className="text-sm text-gray-500 ml-2">/ Documentation</span>
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Book className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to build amazing applications with JCAL.ai
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link href="#quick-start" className="p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Rocket className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Quick Start</h3>
              <p className="text-sm text-gray-600">Get started in 5 minutes</p>
            </Link>
            <Link href="#builder" className="p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Code className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Visual Builder</h3>
              <p className="text-sm text-gray-600">Build with drag & drop</p>
            </Link>
            <Link href="#managed-backend" className="p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <Database className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Backend Setup</h3>
              <p className="text-sm text-gray-600">One-click provisioning</p>
            </Link>
            <Link href="#deploy" className="p-6 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <Rocket className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Deployment</h3>
              <p className="text-sm text-gray-600">Go live instantly</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {sections.map((section) => (
              <div key={section.title}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <div className="space-y-4">
                  {section.docs.map((doc) => (
                    <Link
                      key={doc.name}
                      href={doc.href}
                      className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900 mb-1">{doc.name}</h3>
                      <p className="text-sm text-gray-600">{doc.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Files */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Complete Documentation Files
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors">
              <FileText className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Start Guide</h3>
              <p className="text-gray-600 mb-4">Get JCAL.ai running in 5 minutes</p>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">QUICK_START_JCALAI.md</code>
            </div>
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors">
              <FileText className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Guide</h3>
              <p className="text-gray-600 mb-4">Comprehensive platform documentation</p>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">JCALAI_COMPLETE_GUIDE.md</code>
            </div>
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors">
              <FileText className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Backend System Guide</h3>
              <p className="text-gray-600 mb-4">Database and backend management</p>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">BACKEND_SYSTEM_GUIDE.md</code>
            </div>
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors">
              <FileText className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Implementation Details</h3>
              <p className="text-gray-600 mb-4">Technical architecture and features</p>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">JCALAI_FINAL_IMPLEMENTATION.md</code>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Need Help?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Can't find what you're looking for? We're here to help!
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="mailto:support@jcalai.com">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                Email Support
              </button>
            </Link>
            <Link href="/">
              <button className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2025 Innovix Dynamix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

