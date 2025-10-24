import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Rocket, Code, Database, Zap, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quick Start Guide | JCAL.ai Documentation',
  description: 'Get started with JCAL.ai in 5 minutes - AI-powered no-code app building',
};

export default function QuickStartPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/docs" className="flex items-center">
              <span className="text-sm text-gray-500">← Back to Documentation</span>
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Rocket className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Quick Start Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get up and running with JCAL.ai in just 5 minutes. Build your first AI-powered application today!
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            
            {/* Step 1 */}
            <div className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your Account</h2>
                <p className="text-gray-600 mb-6">
                  Sign up for JCAL.ai using your Google or GitHub account for instant access.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">💡 Pro Tip:</p>
                  <p className="text-blue-700">Use OAuth for faster setup and better security.</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Your First Project</h2>
                <p className="text-gray-600 mb-6">
                  Click "Create New App" on your dashboard and give your project a name.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-mono">Project Name: "My First App"</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Use AI to Build</h2>
                <p className="text-gray-600 mb-6">
                  Switch to the "AI Chat" tab and describe what you want to build. Our AI will create it for you!
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">Example prompts:</p>
                  <ul className="text-green-700 mt-2 space-y-1">
                    <li>• "Create a landing page with a hero section"</li>
                    <li>• "Add a contact form with email validation"</li>
                    <li>• "Build a user dashboard with navigation"</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  4
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Set Up Your Backend</h2>
                <p className="text-gray-600 mb-6">
                  Configure your database and API endpoints using our managed backend or connect your own.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-800 mb-2">Managed Backend</h3>
                    <p className="text-orange-700 text-sm">One-click setup with Supabase</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Custom Backend</h3>
                    <p className="text-gray-700 text-sm">Connect your own database</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  5
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Deploy Your App</h2>
                <p className="text-gray-600 mb-6">
                  Click "Deploy" and your app will be live on Vercel in seconds!
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">🚀 Your app will be live at:</p>
                  <p className="text-red-700 font-mono">https://your-app.vercel.app</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What's Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Code className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Building</h3>
              <p className="text-gray-600 mb-4">Learn about components, templates, and advanced features.</p>
              <Link href="/docs" className="text-blue-600 hover:text-blue-700 font-medium">
                Read More →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Database className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Backend Management</h3>
              <p className="text-gray-600 mb-4">Set up databases, APIs, and data management.</p>
              <Link href="/docs" className="text-green-600 hover:text-green-700 font-medium">
                Read More →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Zap className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Features</h3>
              <p className="text-gray-600 mb-4">Master AI assistance and automation features.</p>
              <Link href="/docs" className="text-purple-600 hover:text-purple-700 font-medium">
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Build?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Start creating amazing applications with AI assistance today!
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/builder/new">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 text-lg">
                Create Your First App
              </button>
            </Link>
            <Link href="/docs">
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 text-lg">
                Browse Documentation
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}