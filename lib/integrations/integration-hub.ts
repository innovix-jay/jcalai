/**
 * Integration Hub
 * Manages connections to third-party services
 */

import { createClient } from '@/lib/supabase/client';

export interface Integration {
  id: string;
  name: string;
  type: 'payment' | 'email' | 'sms' | 'analytics' | 'storage' | 'auth' | 'api';
  description: string;
  icon?: string;
  configFields: ConfigField[];
  features: string[];
  setupInstructions: string;
}

export interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'select' | 'boolean';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  helpText?: string;
}

export const AVAILABLE_INTEGRATIONS: Integration[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    type: 'payment',
    description: 'Accept payments, manage subscriptions, and handle billing.',
    icon: '💳',
    features: [
      'Payment processing',
      'Subscription management',
      'Invoicing',
      'Customer portal',
      'Webhooks',
    ],
    configFields: [
      {
        key: 'publishable_key',
        label: 'Publishable Key',
        type: 'text',
        required: true,
        placeholder: 'pk_test_...',
        helpText: 'Your Stripe publishable key (starts with pk_)',
      },
      {
        key: 'secret_key',
        label: 'Secret Key',
        type: 'password',
        required: true,
        placeholder: 'sk_test_...',
        helpText: 'Your Stripe secret key (starts with sk_)',
      },
      {
        key: 'webhook_secret',
        label: 'Webhook Secret',
        type: 'password',
        required: false,
        placeholder: 'whsec_...',
        helpText: 'Webhook signing secret for event verification',
      },
    ],
    setupInstructions: `
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your publishable and secret keys
3. Create a webhook endpoint at /api/webhooks/stripe
4. Copy the webhook signing secret
    `,
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    type: 'email',
    description: 'Send transactional and marketing emails at scale.',
    icon: '📧',
    features: [
      'Transactional emails',
      'Email templates',
      'Marketing campaigns',
      'Analytics',
      'SMTP relay',
    ],
    configFields: [
      {
        key: 'api_key',
        label: 'API Key',
        type: 'password',
        required: true,
        placeholder: 'SG.xxx',
        helpText: 'Your SendGrid API key',
      },
      {
        key: 'from_email',
        label: 'From Email',
        type: 'text',
        required: true,
        placeholder: 'noreply@example.com',
        helpText: 'Default sender email address',
      },
      {
        key: 'from_name',
        label: 'From Name',
        type: 'text',
        required: false,
        placeholder: 'Your App',
        helpText: 'Default sender name',
      },
    ],
    setupInstructions: `
1. Go to https://app.sendgrid.com/settings/api_keys
2. Create a new API key with Full Access
3. Copy the API key
4. Verify your sender email address
    `,
  },
  {
    id: 'twilio',
    name: 'Twilio',
    type: 'sms',
    description: 'Send SMS, voice calls, and verification codes.',
    icon: '📱',
    features: [
      'SMS messaging',
      'Voice calls',
      'Phone verification',
      'Two-factor authentication',
      'Programmable messaging',
    ],
    configFields: [
      {
        key: 'account_sid',
        label: 'Account SID',
        type: 'text',
        required: true,
        placeholder: 'ACxxxxx',
        helpText: 'Your Twilio Account SID',
      },
      {
        key: 'auth_token',
        label: 'Auth Token',
        type: 'password',
        required: true,
        placeholder: 'xxxxx',
        helpText: 'Your Twilio Auth Token',
      },
      {
        key: 'phone_number',
        label: 'Phone Number',
        type: 'text',
        required: true,
        placeholder: '+1234567890',
        helpText: 'Your Twilio phone number',
      },
    ],
    setupInstructions: `
1. Go to https://console.twilio.com
2. Find your Account SID and Auth Token
3. Purchase a phone number or use an existing one
4. Copy the credentials
    `,
  },
  {
    id: 'aws-s3',
    name: 'AWS S3',
    type: 'storage',
    description: 'Store and serve files, images, and media.',
    icon: '☁️',
    features: [
      'File storage',
      'Image hosting',
      'CDN integration',
      'Access control',
      'Versioning',
    ],
    configFields: [
      {
        key: 'access_key_id',
        label: 'Access Key ID',
        type: 'text',
        required: true,
        placeholder: 'AKIAxxxxx',
        helpText: 'AWS Access Key ID',
      },
      {
        key: 'secret_access_key',
        label: 'Secret Access Key',
        type: 'password',
        required: true,
        placeholder: 'xxxxx',
        helpText: 'AWS Secret Access Key',
      },
      {
        key: 'bucket_name',
        label: 'Bucket Name',
        type: 'text',
        required: true,
        placeholder: 'my-app-bucket',
        helpText: 'S3 bucket name',
      },
      {
        key: 'region',
        label: 'Region',
        type: 'select',
        required: true,
        options: [
          { value: 'us-east-1', label: 'US East (N. Virginia)' },
          { value: 'us-west-2', label: 'US West (Oregon)' },
          { value: 'eu-west-1', label: 'EU (Ireland)' },
          { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
        ],
        helpText: 'AWS region where your bucket is located',
      },
    ],
    setupInstructions: `
1. Go to https://console.aws.amazon.com/s3
2. Create a new bucket or use an existing one
3. Go to IAM and create an access key
4. Configure bucket permissions
    `,
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    type: 'analytics',
    description: 'Track user behavior and website performance.',
    icon: '📊',
    features: [
      'Page view tracking',
      'Event tracking',
      'User analytics',
      'Conversion tracking',
      'Real-time reports',
    ],
    configFields: [
      {
        key: 'measurement_id',
        label: 'Measurement ID',
        type: 'text',
        required: true,
        placeholder: 'G-XXXXXXXXXX',
        helpText: 'Your Google Analytics Measurement ID',
      },
    ],
    setupInstructions: `
1. Go to https://analytics.google.com
2. Create a new GA4 property
3. Copy the Measurement ID (starts with G-)
4. Add the tracking code to your app
    `,
  },
  {
    id: 'openai',
    name: 'OpenAI',
    type: 'api',
    description: 'Add AI capabilities powered by GPT models.',
    icon: '🤖',
    features: [
      'Text generation',
      'Chat completion',
      'Code generation',
      'Image generation (DALL-E)',
      'Embeddings',
    ],
    configFields: [
      {
        key: 'api_key',
        label: 'API Key',
        type: 'password',
        required: true,
        placeholder: 'sk-xxxxx',
        helpText: 'Your OpenAI API key',
      },
      {
        key: 'model',
        label: 'Default Model',
        type: 'select',
        required: false,
        options: [
          { value: 'gpt-4-turbo-preview', label: 'GPT-4 Turbo' },
          { value: 'gpt-4', label: 'GPT-4' },
          { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
        ],
        helpText: 'Default model to use for completions',
      },
    ],
    setupInstructions: `
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the API key
4. Set usage limits if needed
    `,
  },
];

export class IntegrationHub {
  /**
   * Get all available integrations
   */
  getAvailableIntegrations(type?: string): Integration[] {
    if (type) {
      return AVAILABLE_INTEGRATIONS.filter((i) => i.type === type);
    }
    return AVAILABLE_INTEGRATIONS;
  }

  /**
   * Get integration by ID
   */
  getIntegration(id: string): Integration | undefined {
    return AVAILABLE_INTEGRATIONS.find((i) => i.id === id);
  }

  /**
   * Configure an integration for a project
   */
  async configureIntegration(
    projectId: string,
    integrationId: string,
    config: Record<string, string>
  ): Promise<void> {
    const supabase = createClient();
    const integration = this.getIntegration(integrationId);

    if (!integration) {
      throw new Error('Integration not found');
    }

    // Validate required fields
    for (const field of integration.configFields) {
      if (field.required && !config[field.key]) {
        throw new Error(`${field.label} is required`);
      }
    }

    // Save integration configuration
    const { error } = await supabase.from('integrations').upsert({
      project_id: projectId,
      service_name: integration.name,
      service_type: integration.type,
      config: config,
      is_active: true,
      is_configured: true,
    });

    if (error) {
      throw new Error(`Failed to configure integration: ${error.message}`);
    }
  }

  /**
   * Get configured integrations for a project
   */
  async getProjectIntegrations(projectId: string): Promise<any[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('project_id', projectId);

    if (error) {
      console.error('Error fetching integrations:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Test an integration connection
   */
  async testIntegration(integrationId: string, config: Record<string, string>): Promise<boolean> {
    // This would implement actual testing logic for each integration
    // For now, we'll just validate the config format

    const integration = this.getIntegration(integrationId);
    if (!integration) return false;

    // Validate all required fields are present
    for (const field of integration.configFields) {
      if (field.required && !config[field.key]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Generate integration code snippet
   */
  generateCodeSnippet(integrationId: string, language: 'typescript' | 'javascript' = 'typescript'): string {
    const integration = this.getIntegration(integrationId);
    if (!integration) return '';

    const snippets: Record<string, string> = {
      stripe: `
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Create a payment intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000, // Amount in cents
  currency: 'usd',
});
`,
      sendgrid: `
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const msg = {
  to: 'recipient@example.com',
  from: process.env.SENDGRID_FROM_EMAIL!,
  subject: 'Hello from your app',
  text: 'Email content here',
};

await sgMail.send(msg);
`,
      twilio: `
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

await client.messages.create({
  body: 'Your message here',
  from: process.env.TWILIO_PHONE_NUMBER,
  to: '+1234567890',
});
`,
      'aws-s3': `
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

await s3.send(new PutObjectCommand({
  Bucket: process.env.AWS_BUCKET_NAME,
  Key: 'file-name.txt',
  Body: fileBuffer,
}));
`,
      openai: `
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const completion = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [{ role: 'user', content: 'Hello!' }],
});
`,
    };

    return snippets[integrationId] || '';
  }
}

// Singleton instance
export const integrationHub = new IntegrationHub();


