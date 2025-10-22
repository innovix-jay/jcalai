import Link from 'next/link';
import { Sparkles, Calendar, User, ArrowLeft } from 'lucide-react';
import { JCALLogo } from '@/components/ui/jcal-logo';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // This would fetch from a CMS or database in production
  const post = {
    title: 'Introducing JCAL.ai: The Future of No-Code Development',
    date: 'January 15, 2025',
    author: 'JCAL Team',
    category: 'Product',
    content: `
We're thrilled to introduce JCAL.ai—a revolutionary no-code platform that's changing how applications are built.

## What is JCAL.ai?

JCAL.ai is the ultimate AI-powered no-code application builder. Unlike other platforms, we've combined cutting-edge AI technology with flexible backend options to create something truly unique.

## Key Innovations

### 1. Intelligent AI Model Routing

We're the only platform that automatically selects the best AI model for your specific task. Whether it's Claude for complex code generation, GPT-4 for creative UI components, or Gemini for cost-effective solutions—our router makes the optimal choice every time.

### 2. Managed Backend System

For the first time ever, users can get a production-ready backend with literally one click. No Supabase account needed, no configuration required—just instant infrastructure that scales.

### 3. Bring Your Own Backend

But we also know developers have existing infrastructure. That's why we support connecting to 8 different database providers:
- PostgreSQL
- MySQL
- MongoDB
- Firebase
- AWS RDS
- PlanetScale
- CockroachDB
- Custom Supabase

## Who is JCAL.ai For?

### Entrepreneurs
Turn your ideas into MVPs in minutes, not months. No technical co-founder needed.

### Developers
Speed up development with AI assistance while maintaining full control and code ownership.

### Agencies
Build client projects faster with templates, AI generation, and one-click deployment.

### Enterprises
Create internal tools on your existing infrastructure with our flexible backend options.

## What You Can Build

With JCAL.ai, you can build:
- SaaS applications
- E-commerce stores
- Task management tools
- CRM systems
- Admin dashboards
- Landing pages
- And literally anything else you can imagine

## Getting Started

Ready to try it yourself?

1. Sign up for free at jcalai.com
2. Describe your app idea to our AI
3. Watch it generate in 15 seconds
4. Customize in the visual builder
5. Deploy with one click

It's really that simple.

## What's Next

We're just getting started. Coming soon:
- Real-time collaboration
- Mobile app builder
- Advanced automation workflows
- Plugin marketplace

## Join Us

JCAL.ai is more than a tool—it's a movement to democratize software development. We believe everyone should be able to build their ideas, regardless of technical background.

Ready to build something amazing?

[Get Started Free](https://jcalai.com/auth/signup)
    `,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <JCALLogo size="md" />
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900 flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-8">
          <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all posts
          </Link>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>
          <div className="flex items-center space-x-6 text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {post.date}
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {post.author}
            </div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          {post.content.split('\n').map((paragraph, i) => {
            if (paragraph.startsWith('## ')) {
              return <h2 key={i}>{paragraph.replace('## ', '')}</h2>;
            } else if (paragraph.startsWith('### ')) {
              return <h3 key={i}>{paragraph.replace('### ', '')}</h3>;
            } else if (paragraph.trim()) {
              return <p key={i}>{paragraph}</p>;
            }
            return null;
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Build Your App?
          </h3>
          <p className="text-blue-100 mb-6">
            Join thousands of creators building amazing applications
          </p>
          <Link href="/auth/signup">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Get Started Free
            </button>
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2025 Innovix Dynamix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

