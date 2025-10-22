import Link from 'next/link';
import { Sparkles, Calendar, User, ArrowRight } from 'lucide-react';
import { JCALLogo } from '@/components/ui/jcal-logo';

export default function BlogPage() {
  const posts = [
    {
      title: 'Introducing JCAL.ai: The Future of No-Code Development',
      excerpt: 'Learn how JCAL.ai is revolutionizing app development with AI-powered tools and flexible backend options.',
      date: 'January 15, 2025',
      author: 'JCAL Team',
      category: 'Product',
      slug: 'introducing-jcalai',
    },
    {
      title: 'Managed Backend vs. Bring Your Own: Which is Right for You?',
      excerpt: 'A comprehensive guide to choosing between our instant managed backend and connecting your own database.',
      date: 'January 12, 2025',
      author: 'Engineering Team',
      category: 'Technical',
      slug: 'backend-comparison',
    },
    {
      title: 'How AI Model Routing Works in JCAL.ai',
      excerpt: 'Deep dive into our intelligent routing system that automatically selects the best AI model for your task.',
      date: 'January 10, 2025',
      author: 'AI Team',
      category: 'Technical',
      slug: 'ai-routing',
    },
  ];

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

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            JCAL.ai Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Latest updates, tutorials, and insights from the JCAL.ai team
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {posts.map((post) => (
              <article key={post.slug} className="border-b border-gray-200 pb-12 last:border-0">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                    {post.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    {post.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {post.excerpt}
                </p>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
                >
                  Read more
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </article>
            ))}
          </div>

          {/* Coming Soon Message */}
          <div className="text-center py-12 bg-gray-50 rounded-lg mt-12">
            <p className="text-gray-600 mb-4">More blog posts coming soon!</p>
            <p className="text-sm text-gray-500">
              Subscribe to our newsletter to get notified of new articles
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Stay Updated
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get the latest updates, tutorials, and insights delivered to your inbox
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-100">
              Subscribe
            </button>
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

