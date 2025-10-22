import Link from 'next/link';
import { Sparkles, Target, Heart, Users, Zap, Code } from 'lucide-react';
import { JCALLogo } from '@/components/ui/jcal-logo';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <JCALLogo size="md" />
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About JCAL.ai
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to democratize software development and empower everyone to build amazing applications—no coding required.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                At JCAL.ai, we believe that everyone should have the power to bring their ideas to life—regardless of technical background. We're building the most advanced no-code platform that combines the power of AI with intuitive visual tools.
              </p>
              <p className="text-lg text-gray-600">
                Our platform leverages multiple AI models (Claude, GPT-4, Gemini) to automatically generate production-ready applications from natural language descriptions. But we don't stop there—we give you complete control over your backend, data, and deployment.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl">
                <Target className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-sm text-gray-600">Pushing boundaries of what's possible with AI</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl">
                <Heart className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Accessibility</h3>
                <p className="text-sm text-gray-600">Making tech accessible to everyone</p>
              </div>
              <div className="bg-pink-50 p-6 rounded-xl">
                <Users className="w-12 h-12 text-pink-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
                <p className="text-sm text-gray-600">Building together, growing together</p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl">
                <Zap className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Speed</h3>
                <p className="text-sm text-gray-600">From idea to production in minutes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
          <div className="space-y-6 text-lg text-gray-600">
            <p>
              JCAL.ai was born from a simple observation: there's a massive gap between having an idea and being able to build it. Traditional development requires months of learning, expensive developers, or settling for limited no-code tools that don't scale.
            </p>
            <p>
              We asked ourselves: what if we could combine the power of the world's best AI models with a truly flexible backend system? What if users could choose between instant managed infrastructure or connecting their own databases? What if we made deployment as simple as clicking a button?
            </p>
            <p>
              The result is JCAL.ai—a platform that doesn't just generate code, but provides a complete ecosystem for building, managing, and deploying production applications. We've created something that doesn't exist anywhere else: true flexibility with zero compromise on power.
            </p>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Sets Us Apart</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Innovation</h3>
              <p className="text-gray-600">
                Only platform with intelligent routing between multiple AI models for optimal results
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Backend Flexibility</h3>
              <p className="text-gray-600">
                Choose instant managed backend or connect your own—8 database providers supported
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">True Ownership</h3>
              <p className="text-gray-600">
                Export complete source code, deploy anywhere, no vendor lock-in
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Built by Innovix Dynamix</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            JCAL.ai is a product of Innovix Dynamix, a technology company dedicated to building tools that empower the next generation of creators and builders.
          </p>
          <div className="text-center">
            <Link 
              href="https://innovixdynamix.com"
              target="_blank"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              Learn more about Innovix Dynamix →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join us in reshaping how software is built. Create your first app in minutes.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/auth/signup">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Started Free
              </button>
            </Link>
            <Link href="/">
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Learn More
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

