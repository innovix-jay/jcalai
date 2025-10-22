import Link from 'next/link';
import { Sparkles, Shield } from 'lucide-react';
import { JCALLogo } from '@/components/ui/jcal-logo';

export default function PrivacyPage() {
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

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 15, 2025</p>
          <p className="text-sm text-gray-500 mt-2">JCAL.ai by Innovix Dynamix</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Innovix Dynamix ("we", "us", "our", or "Company") operates the JCAL.ai platform ("Service"). 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you use our AI-powered no-code application development platform.
          </p>
          <p>
            By using JCAL.ai, you consent to the data practices described in this Privacy Policy. 
            If you do not agree with the practices described herein, please do not use our Service.
          </p>

          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Personal Information</h3>
          <p>We collect information you provide directly to us, including:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, password, and profile information when you create an account</li>
            <li><strong>Project Data:</strong> Applications you build, including pages, components, configurations, and source code</li>
            <li><strong>Payment Information:</strong> Billing details processed securely through Stripe (we do not store credit card information)</li>
            <li><strong>Communications:</strong> Messages you send to our support team, feedback, and survey responses</li>
            <li><strong>AI Prompts:</strong> Natural language descriptions you provide to generate applications</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <p>We automatically collect certain information when you use our Service:</p>
          <ul>
            <li><strong>Usage Data:</strong> How you interact with our platform, features used, time spent, and performance metrics</li>
            <li><strong>Device Information:</strong> Browser type, IP address, operating system, device identifiers, and screen resolution</li>
            <li><strong>Analytics Data:</strong> Aggregated data about platform usage, error reports, and performance statistics</li>
            <li><strong>Cookies and Tracking:</strong> Information collected through cookies, web beacons, and similar technologies</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our Service</li>
            <li>Process transactions and manage your account</li>
            <li>Generate applications based on your AI prompts and specifications</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Improve our AI models and platform functionality</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Detect, prevent, and address technical issues and security vulnerabilities</li>
            <li>Comply with legal obligations and enforce our terms</li>
          </ul>

          <h2>4. Data Storage and Security</h2>
          <p>We implement comprehensive security measures to protect your data:</p>
          <ul>
            <li><strong>Encryption:</strong> All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
            <li><strong>Database Security:</strong> Row-Level Security (RLS) policies enforce strict data isolation</li>
            <li><strong>Access Controls:</strong> Multi-factor authentication and role-based access controls</li>
            <li><strong>Regular Audits:</strong> Security assessments, penetration testing, and compliance reviews</li>
            <li><strong>Infrastructure Security:</strong> Secure cloud hosting with enterprise-grade security</li>
          </ul>

          <h2>5. Your Project Data and Intellectual Property</h2>
          <p>
            <strong>You retain complete ownership of your data and applications.</strong> This includes:
          </p>
          <ul>
            <li>All applications you build using JCAL.ai</li>
            <li>Source code generated or exported from our platform</li>
            <li>Database content, schemas, and configurations</li>
            <li>Visual designs, UI components, and customizations</li>
            <li>AI prompts and specifications you provide</li>
          </ul>
          <p>
            We provide you with complete data portability and export capabilities. 
            You can download your source code and data at any time.
          </p>

          <h2>6. Third-Party Services and Integrations</h2>
          <p>JCAL.ai integrates with trusted third-party services:</p>
          <ul>
            <li><strong>Supabase:</strong> Database and authentication services</li>
            <li><strong>Vercel:</strong> Hosting and deployment services</li>
            <li><strong>Stripe:</strong> Payment processing</li>
            <li><strong>AI Providers:</strong> Anthropic (Claude), OpenAI (GPT-4), Google (Gemini)</li>
            <li><strong>Analytics:</strong> Google Analytics and performance monitoring tools</li>
          </ul>
          <p>
            These services have their own privacy policies. When you use JCAL.ai, 
            you also agree to their terms and privacy practices.
          </p>

          <h2>7. Cookies and Tracking Technologies</h2>
          <p>We use cookies and similar technologies to:</p>
          <ul>
            <li>Keep you logged in and maintain your session</li>
            <li>Remember your preferences and settings</li>
            <li>Analyze platform usage and performance</li>
            <li>Improve user experience and functionality</li>
            <li>Provide personalized content and recommendations</li>
          </ul>
          <p>
            You can control cookies through your browser settings. 
            Note that disabling cookies may affect platform functionality.
          </p>

          <h2>8. Your Rights and Choices</h2>
          <p>You have the following rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
            <li><strong>Portability:</strong> Download your data in a machine-readable format</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
          </ul>
          <p>
            To exercise these rights, contact us at privacy@jcalai.com. 
            We will respond to your request within 30 days.
          </p>

          <h2>9. Data Retention</h2>
          <p>
            We retain your information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy:
          </p>
          <ul>
            <li><strong>Account Data:</strong> Retained while your account is active</li>
            <li><strong>Project Data:</strong> Retained until you delete your account or specific projects</li>
            <li><strong>Usage Data:</strong> Retained for up to 2 years for analytics and improvement</li>
            <li><strong>Legal Requirements:</strong> Some data may be retained longer for legal compliance</li>
          </ul>
          <p>
            When you delete your account, we will delete your personal data within 30 days, 
            unless we are required to retain it for legal reasons.
          </p>

          <h2>10. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own. 
            We ensure appropriate safeguards are in place for international transfers, including:
          </p>
          <ul>
            <li>Standard Contractual Clauses approved by the European Commission</li>
            <li>Adequacy decisions by relevant data protection authorities</li>
            <li>Certification schemes and codes of conduct</li>
          </ul>

          <h2>11. Children's Privacy</h2>
          <p>
            JCAL.ai is not intended for users under 13 years of age. We do not knowingly collect 
            personal information from children under 13. If we become aware that we have collected 
            personal information from a child under 13, we will take steps to delete such information.
          </p>

          <h2>12. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material 
            changes by:
          </p>
          <ul>
            <li>Posting the updated Privacy Policy on our website</li>
            <li>Sending you an email notification</li>
            <li>Displaying a prominent notice on our platform</li>
          </ul>
          <p>
            Your continued use of JCAL.ai after any changes constitutes acceptance of the updated Privacy Policy.
          </p>

          <h2>13. Contact Information</h2>
          <p>
            If you have questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <ul>
            <li><strong>Email:</strong> privacy@jcalai.com</li>
            <li><strong>Website:</strong> https://jcalai.com</li>
            <li><strong>Company:</strong> Innovix Dynamix</li>
            <li><strong>Data Protection Officer:</strong> dpo@innovixdynamix.com</li>
          </ul>

          <h2>14. Regional Privacy Rights</h2>
          
          <h3>14.1 European Economic Area (EEA) - GDPR</h3>
          <p>For users in the EEA, we comply with GDPR requirements:</p>
          <ul>
            <li><strong>Legal Basis:</strong> Consent, contract performance, and legitimate interests</li>
            <li><strong>Data Protection Officer:</strong> Available at dpo@innovixdynamix.com</li>
            <li><strong>Supervisory Authority:</strong> You have the right to lodge a complaint with your local data protection authority</li>
            <li><strong>Data Portability:</strong> Right to receive your data in a structured, machine-readable format</li>
          </ul>

          <h3>14.2 California - CCPA/CPRA</h3>
          <p>California residents have additional rights under CCPA/CPRA:</p>
          <ul>
            <li><strong>Right to Know:</strong> What personal information is collected and how it's used</li>
            <li><strong>Right to Delete:</strong> Request deletion of personal information</li>
            <li><strong>Right to Opt-Out:</strong> Opt-out of the sale of personal information (we do not sell personal information)</li>
            <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights</li>
          </ul>

          <h3>14.3 Other Jurisdictions</h3>
          <p>
            We comply with applicable privacy laws in all jurisdictions where we operate, 
            including but not limited to PIPEDA (Canada), LGPD (Brazil), and other regional privacy regulations.
          </p>

          <h2>15. Security Incident Response</h2>
          <p>
            In the event of a data breach that may affect your personal information, we will:
          </p>
          <ul>
            <li>Notify affected users within 72 hours of discovery</li>
            <li>Report to relevant authorities as required by law</li>
            <li>Provide detailed information about the incident and steps taken</li>
            <li>Offer assistance and resources to affected users</li>
          </ul>

          <h2>16. Data Processing Agreements</h2>
          <p>
            For enterprise customers and partners, we provide comprehensive Data Processing Agreements (DPAs) 
            that outline specific data handling requirements, security measures, and compliance obligations.
          </p>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg text-center">
          <p className="text-gray-700 mb-4">
            Questions about privacy? We're committed to protecting your data and privacy.
          </p>
          <Link href="mailto:privacy@jcalai.com">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
              Contact Privacy Team
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2025 Innovix Dynamix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}