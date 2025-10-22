import Link from 'next/link';
import { Sparkles, FileText } from 'lucide-react';
import { JCALLogo } from '@/components/ui/jcal-logo';

export default function TermsPage() {
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
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: January 15, 2025</p>
          <p className="text-sm text-gray-500 mt-2">JCAL.ai by Innovix Dynamix</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>1. Agreement to Terms</h2>
          <p>
            These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "you", or "your") 
            and Innovix Dynamix ("Company", "we", "us", or "our") regarding your use of the JCAL.ai platform ("Service"). 
            By accessing or using JCAL.ai, you agree to be bound by these Terms.
          </p>
          <p>
            If you disagree with any part of these terms, you may not access the Service. 
            These Terms apply to all visitors, users, and others who access or use the Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            JCAL.ai is an AI-powered no-code application development platform that enables users to build, 
            deploy, and manage web applications using artificial intelligence, visual tools, and automated 
            backend provisioning. The Service includes:
          </p>
          <ul>
            <li>AI-powered application generation and scaffolding</li>
            <li>Visual drag-and-drop application builder</li>
            <li>Managed backend provisioning and database management</li>
            <li>Integration with external databases and services</li>
            <li>One-click deployment and hosting services</li>
            <li>Code export and source code access</li>
            <li>Template library and component marketplace</li>
            <li>Team collaboration and project management tools</li>
          </ul>

          <h2>3. Account Registration and Eligibility</h2>
          <p>To use JCAL.ai, you must:</p>
          <ul>
            <li>Be at least 13 years of age (or the age of majority in your jurisdiction)</li>
            <li>Provide accurate, current, and complete registration information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Promptly update your account information when it changes</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>
          <p>
            We reserve the right to refuse service, terminate accounts, or remove content 
            at our sole discretion.
          </p>

          <h2>4. User Data and Intellectual Property Rights</h2>
          
          <h3>4.1 Your Content and Ownership</h3>
          <p>
            <strong>You retain all rights to content you create using JCAL.ai.</strong> This includes:
          </p>
          <ul>
            <li>Applications you build using our platform</li>
            <li>Source code generated or exported from JCAL.ai</li>
            <li>Database content, schemas, and configurations</li>
            <li>Visual designs, UI components, and customizations</li>
            <li>AI prompts, specifications, and requirements you provide</li>
            <li>Custom integrations and third-party connections</li>
          </ul>

          <h3>4.2 License to JCAL.ai</h3>
          <p>
            By using our Service, you grant us a limited, non-exclusive, royalty-free license to:
          </p>
          <ul>
            <li>Host, store, and process your content solely to provide the Service</li>
            <li>Generate applications based on your specifications and prompts</li>
            <li>Provide technical support and platform maintenance</li>
            <li>Improve our AI models and platform functionality</li>
            <li>Ensure compliance with these Terms and applicable laws</li>
          </ul>
          <p>
            This license terminates when you delete your content or account, 
            except as necessary for legal compliance or platform security.
          </p>

          <h3>4.3 Code Ownership and Export Rights</h3>
          <p>
            All code you export from JCAL.ai is yours. You may:
          </p>
          <ul>
            <li>Use it for any purpose (commercial or personal)</li>
            <li>Modify, distribute, and sell applications built with exported code</li>
            <li>Deploy it on any platform or infrastructure</li>
            <li>Include it in other projects or combine it with other code</li>
            <li>Transfer ownership to third parties</li>
          </ul>

          <h2>5. Acceptable Use Policy</h2>
          <p>You agree not to use JCAL.ai to:</p>
          <ul>
            <li>Violate any applicable laws, regulations, or third-party rights</li>
            <li>Infringe on intellectual property rights of others</li>
            <li>Distribute malware, viruses, or other harmful code</li>
            <li>Engage in fraudulent, deceptive, or illegal activities</li>
            <li>Harass, abuse, threaten, or harm others</li>
            <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Use the Service to build applications that violate these Terms</li>
            <li>Circumvent security measures or access controls</li>
            <li>Use automated systems to access the Service without permission</li>
            <li>Reverse engineer, decompile, or disassemble our software</li>
          </ul>

          <h2>6. AI-Generated Content and Disclaimers</h2>
          <p>
            JCAL.ai uses artificial intelligence models (including Claude, GPT-4, and Gemini) 
            to assist in application development:
          </p>
          <ul>
            <li><strong>No Warranty:</strong> AI-generated content is provided "as is" without warranties</li>
            <li><strong>User Responsibility:</strong> You are responsible for reviewing and testing AI-generated code</li>
            <li><strong>No Guarantee:</strong> We do not guarantee AI output will be error-free or suitable for your purpose</li>
            <li><strong>Verification Required:</strong> You should verify AI-generated content meets your requirements</li>
            <li><strong>Third-Party Models:</strong> AI models are provided by third parties with their own terms</li>
          </ul>

          <h2>7. Backend Services and Data Management</h2>
          
          <h3>7.1 JCAL Managed Backend</h3>
          <p>
            When using our managed backend services:
          </p>
          <ul>
            <li>We provide infrastructure hosted on secure cloud platforms</li>
            <li>Your data is isolated and protected using industry-standard security</li>
            <li>Resource usage is monitored and may be limited based on your plan</li>
            <li>We reserve the right to suspend services for policy violations</li>
            <li>Data backup and recovery procedures are implemented</li>
          </ul>

          <h3>7.2 External Backend Connections</h3>
          <p>
            When connecting external databases or services:
          </p>
          <ul>
            <li>You are responsible for security and compliance of your infrastructure</li>
            <li>We are not liable for data loss or breaches in external systems</li>
            <li>You must have proper authorization to connect databases</li>
            <li>Connection credentials are encrypted and stored securely</li>
            <li>You can disconnect external services at any time</li>
          </ul>

          <h2>8. Payment Terms and Billing</h2>
          <ul>
            <li><strong>Free Tier:</strong> Limited features and resources available at no cost</li>
            <li><strong>Paid Plans:</strong> Billed monthly or annually via Stripe payment processing</li>
            <li><strong>Refunds:</strong> Available within 14 days of initial purchase for paid plans</li>
            <li><strong>Cancellation:</strong> Cancel anytime; access continues until end of billing period</li>
            <li><strong>Price Changes:</strong> We will notify you 30 days before any price increases</li>
            <li><strong>Taxes:</strong> You are responsible for applicable taxes based on your location</li>
            <li><strong>Payment Methods:</strong> Credit cards, debit cards, and other accepted payment methods</li>
          </ul>

          <h2>9. Service Availability and Uptime</h2>
          <p>
            While we strive for high availability:
          </p>
          <ul>
            <li>We do not guarantee uninterrupted or error-free service</li>
            <li>Scheduled maintenance will be announced in advance when possible</li>
            <li>We are not liable for downtime or service interruptions</li>
            <li>SLA guarantees are available for Enterprise plans</li>
            <li>We may temporarily suspend service for security or maintenance reasons</li>
          </ul>

          <h2>10. Intellectual Property Rights</h2>
          
          <h3>10.1 JCAL.ai Platform</h3>
          <p>
            The JCAL.ai platform, including all software, design, content, and functionality 
            (excluding user-generated content), is owned by Innovix Dynamix and protected by 
            intellectual property laws, including copyright, trademark, and patent rights.
          </p>

          <h3>10.2 Trademarks</h3>
          <p>
            JCAL.ai, Innovix Dynamix, and associated logos are trademarks of Innovix Dynamix. 
            You may not use these trademarks without our written permission.
          </p>

          <h3>10.3 Third-Party Intellectual Property</h3>
          <p>
            Our Service may include third-party software, content, or services. 
            Use of such materials is subject to their respective terms and licenses.
          </p>

          <h2>11. Third-Party Services and Integrations</h2>
          <p>
            JCAL.ai integrates with third-party services. Your use of these services is subject to their terms:
          </p>
          <ul>
            <li><strong>Supabase:</strong> Database and authentication services</li>
            <li><strong>Vercel:</strong> Deployment and hosting services</li>
            <li><strong>Stripe:</strong> Payment processing services</li>
            <li><strong>AI Providers:</strong> Anthropic (Claude), OpenAI (GPT-4), Google (Gemini)</li>
            <li><strong>Cloud Providers:</strong> AWS, Google Cloud, Microsoft Azure</li>
          </ul>
          <p>
            We are not responsible for the availability, functionality, or terms of third-party services.
          </p>

          <h2>12. Privacy and Data Protection</h2>
          <p>
            Your use of JCAL.ai is also governed by our Privacy Policy. We are committed to:
          </p>
          <ul>
            <li>Protecting your personal information and project data</li>
            <li>Complying with GDPR, CCPA, and other privacy regulations</li>
            <li>Implementing industry-standard security measures</li>
            <li>Providing transparency about data collection and use</li>
            <li>Honoring your privacy rights and choices</li>
          </ul>

          <h2>13. Termination</h2>
          
          <h3>13.1 Termination by You</h3>
          <p>
            You may terminate your account at any time through account settings. Upon termination:
          </p>
          <ul>
            <li>Your access to the Service will cease</li>
            <li>You can export your data before deletion</li>
            <li>Data will be deleted within 30 days</li>
            <li>You remain responsible for any outstanding payments</li>
          </ul>

          <h3>13.2 Termination by Us</h3>
          <p>
            We may suspend or terminate your account if you:
          </p>
          <ul>
            <li>Violate these Terms or our policies</li>
            <li>Engage in fraudulent or illegal activity</li>
            <li>Fail to pay for services when due</li>
            <li>Use the Service in a way that harms us or others</li>
            <li>Provide false or misleading information</li>
          </ul>

          <h2>14. Warranties and Disclaimers</h2>
          <p>
            JCAL.ai IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul>
            <li>MERCHANTABILITY</li>
            <li>FITNESS FOR A PARTICULAR PURPOSE</li>
            <li>NON-INFRINGEMENT</li>
            <li>SECURITY OR ACCURACY</li>
            <li>UNINTERRUPTED OR ERROR-FREE OPERATION</li>
          </ul>
          <p>
            We do not warrant that the Service will meet your requirements or be available 
            at all times.
          </p>

          <h2>15. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, INNOVIX DYNAMIX SHALL NOT BE LIABLE FOR:
          </p>
          <ul>
            <li>INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES</li>
            <li>LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES</li>
            <li>DAMAGES EXCEEDING THE AMOUNT PAID TO US IN THE PAST 12 MONTHS</li>
            <li>DAMAGES RESULTING FROM THIRD-PARTY SERVICES OR INTEGRATIONS</li>
            <li>DAMAGES RESULTING FROM UNAUTHORIZED ACCESS TO YOUR ACCOUNT</li>
          </ul>
          <p>
            Some jurisdictions do not allow limitation of liability, so these limitations 
            may not apply to you.
          </p>

          <h2>16. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Innovix Dynamix from claims arising from:
          </p>
          <ul>
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any rights of others</li>
            <li>Applications you build and deploy using JCAL.ai</li>
            <li>Your violation of applicable laws or regulations</li>
          </ul>

          <h2>17. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms are governed by the laws of the United States, without regard to 
            conflict of law principles. Any disputes will be resolved through:
          </p>
          <ul>
            <li><strong>Good Faith Negotiation:</strong> First attempt to resolve disputes amicably</li>
            <li><strong>Mediation:</strong> If negotiation fails, disputes will be mediated</li>
            <li><strong>Arbitration:</strong> As a last resort, binding arbitration will be used</li>
          </ul>
          <p>
            You waive any right to participate in class action lawsuits or class-wide arbitration.
          </p>

          <h2>18. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. We will notify you of significant changes by:
          </p>
          <ul>
            <li>Posting the updated Terms on our website</li>
            <li>Sending you an email notification</li>
            <li>Displaying a prominent notice on our platform</li>
          </ul>
          <p>
            Continued use of the Service after changes constitutes acceptance of the updated Terms.
          </p>

          <h2>19. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, 
            the remaining provisions will continue in full force and effect.
          </p>

          <h2>20. Entire Agreement</h2>
          <p>
            These Terms, along with our Privacy Policy and any additional agreements, 
            constitute the entire agreement between you and Innovix Dynamix regarding the Service.
          </p>

          <h2>21. Contact Information</h2>
          <p>
            For questions about these Terms, please contact us:
          </p>
          <ul>
            <li><strong>Email:</strong> legal@jcalai.com</li>
            <li><strong>Website:</strong> https://jcalai.com</li>
            <li><strong>Company:</strong> Innovix Dynamix</li>
            <li><strong>Address:</strong> Available upon request for legal matters</li>
          </ul>

          <h2>22. Enterprise Terms</h2>
          <p>
            Enterprise customers may have additional terms and conditions outlined in 
            separate Enterprise Agreements that supplement these Terms.
          </p>

          <h2>23. Compliance and Export Control</h2>
          <p>
            You agree to comply with all applicable export control laws and regulations. 
            You may not use the Service in violation of any trade sanctions or export restrictions.
          </p>

          <h2>24. Force Majeure</h2>
          <p>
            We shall not be liable for any failure or delay in performance due to circumstances 
            beyond our reasonable control, including but not limited to acts of God, natural disasters, 
            war, terrorism, or government actions.
          </p>
        </div>

        <div className="mt-12 p-6 bg-gray-100 rounded-lg">
          <p className="text-gray-700 mb-4 font-semibold">
            By using JCAL.ai, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
          <div className="flex space-x-4">
            <Link href="/auth/signup">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
                Accept & Sign Up
              </button>
            </Link>
            <Link href="/">
              <button className="border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50">
                Back to Home
              </button>
            </Link>
          </div>
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