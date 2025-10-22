import Link from 'next/link';
import { Sparkles, Briefcase, Heart, Zap, Users, Rocket } from 'lucide-react';
import { JCALLogo } from '@/components/ui/jcal-logo';

export default function CareersPage() {
  const openings = [
    {
      title: 'Senior Full-Stack Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
    },
    {
      title: 'AI/ML Engineer',
      department: 'AI Research',
      location: 'Remote',
      type: 'Full-time',
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
    },
  ];

  const values = [
    {
      icon: Rocket,
      title: 'Innovation First',
      description: 'We push boundaries and build what doesn\'t exist yet',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We work together to achieve amazing things',
    },
    {
      icon: Heart,
      title: 'User-Centric',
      description: 'Everything we do is for our users',
    },
    {
      icon: Zap,
      title: 'Move Fast',
      description: 'We ship quickly and iterate continuously',
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
          <Briefcase className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help us build the future of no-code development and empower millions to create amazing applications
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Open Positions</h2>
          <div className="space-y-4">
            {openings.map((job, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <Link href="mailto:careers@jcalai.com">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
                      Apply
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Don't see the right role? We're always looking for talented people.
            </p>
            <Link href="mailto:careers@jcalai.com">
              <button className="text-blue-600 font-semibold hover:text-blue-700">
                Send us your resume →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why JCAL.ai?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">🌍 Work From Anywhere</h3>
              <p className="text-gray-600">Fully remote company with flexible hours</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">💰 Competitive Pay</h3>
              <p className="text-gray-600">Market-leading salaries and equity</p>
            </div>
            <div className="bg-pink-50 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">🏥 Health Benefits</h3>
              <p className="text-gray-600">Comprehensive health, dental, and vision</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">📚 Learning Budget</h3>
              <p className="text-gray-600">Annual budget for courses and conferences</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">🏖️ Unlimited PTO</h3>
              <p className="text-gray-600">Take time off when you need it</p>
            </div>
            <div className="bg-red-50 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">🚀 Impact</h3>
              <p className="text-gray-600">Work on products used by thousands</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our team and help shape the future of software development
          </p>
          <Link href="mailto:careers@jcalai.com">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Get in Touch
            </button>
          </Link>
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

