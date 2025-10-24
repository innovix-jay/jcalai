import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | JCAL.ai',
  description: 'Privacy Policy for JCAL.ai - AI-Powered No-Code App Builder by Innovix Dynamix',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              <strong>Last updated:</strong> October 24, 2024
            </p>

            <h2 className="text-2xl font-semibold text-purple-400 mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-300 mb-6">
              JCAL.ai ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered no-code app building platform.
            </p>

            <h2 className="text-2xl font-semibold text-purple-400 mt-8 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">2.1 Personal Information</h3>
            <ul className="text-gray-300 mb-6 list-disc pl-6">
              <li>Email address and name when you create an account</li>
              <li>Profile information you choose to provide</li>
              <li>Payment information (processed securely through Stripe)</li>
            </ul>

            <h3 className="text-xl font-semibold text-blue-400 mt-6 mb-3">2.2 Usage Information</h3>
            <ul className="text-gray-300 mb-6 list-disc pl-6">
              <li>Projects and applications you create</li>
              <li>AI interactions and prompts</li>
              <li>Platform usage patterns and preferences</li>
              <li>Device and browser information</li>
            </ul>

            <h2 className="text-2xl font-semibold text-purple-400 mt-8 mb-4">3. How We Use Your Information</h2>
            <ul className="text-gray-300 mb-6 list-disc pl-6">
              <li>Provide and improve our AI-powered app building services</li>
              <li>Process payments and manage subscriptions</li>
              <li>Communicate with you about your account and our services</li>
              <li>Analyze usage patterns to enhance platform performance</li>
              <li>Ensure platform security and prevent fraud</li>
            </ul>

            <h2 className="text-2xl font-semibold text-purple-400 mt-8 mb-4">4. Information Sharing</h2>
            <p className="text-gray-300 mb-6">
              We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:
            </p>
            <ul className="text-gray-300 mb-6 list-disc pl-6">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>With trusted service providers who assist in platform operations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-purple-400 mt-8 mb-4">5. Data Security</h2>
            <p className="text-gray-300 mb-6">
              We implement industry-standard security measures to protect your information, including encryption, secure data transmission, and regular security audits.
            </p>

            <h2 className="text-2xl font-semibold text-purple-400 mt-8 mb-4">6. Your Rights</h2>
            <p className="text-gray-300 mb-6">
              You have the right to:
            </p>
            <ul className="text-gray-300 mb-6 list-disc pl-6">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
              <li>Request data portability</li>
            </ul>

            <h2 className="text-2xl font-semibold text-purple-400 mt-8 mb-4">7. Contact Us</h2>
            <p className="text-gray-300 mb-6">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <p className="text-gray-300">
                <strong>Innovix Dynamix</strong><br />
                Email: privacy@innovixdynamix.com<br />
                Website: https://innovixdynamix.com
              </p>
            </div>

            <p className="text-gray-300 text-sm">
              This Privacy Policy is effective as of the date listed above and may be updated periodically. We will notify you of any material changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}