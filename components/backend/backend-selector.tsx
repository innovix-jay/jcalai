'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Database,
  Zap,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Settings,
  Cloud,
  Server,
} from 'lucide-react';
import { DATABASE_PROVIDERS, databaseConnector } from '@/lib/backend/database-connectors';
import toast from 'react-hot-toast';

interface BackendSelectorProps {
  projectId: string;
  onComplete: (backendConfig: any) => void;
  onCancel?: () => void;
}

export function BackendSelector({ projectId, onComplete, onCancel }: BackendSelectorProps) {
  const [step, setStep] = useState<'choice' | 'managed-setup' | 'external-setup'>('choice');
  const [backendType, setBackendType] = useState<'jcal-managed' | 'external' | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleChooseManaged = () => {
    setBackendType('jcal-managed');
    setStep('managed-setup');
  };

  const handleChooseExternal = () => {
    setBackendType('external');
    setStep('external-setup');
  };

  const handleProvisionManaged = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/backend/provision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          backendType: 'jcal-managed',
        }),
      });

      if (!response.ok) throw new Error('Failed to provision backend');

      const result = await response.json();
      toast.success('Backend provisioned successfully!');
      onComplete(result);
    } catch (error) {
      toast.error('Failed to provision backend');
      console.error(error);
    }
  };

  const handleTestConnection = async () => {
    if (!selectedProvider) return;

    setTesting(true);
    setConnectionStatus('testing');

    try {
      const result = await databaseConnector.testConnection(selectedProvider, credentials);

      if (result.success) {
        setConnectionStatus('success');
        toast.success(`Connection successful! (${result.latency}ms)`);
      } else {
        setConnectionStatus('error');
        toast.error(result.message);
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error('Connection test failed');
    } finally {
      setTesting(false);
    }
  };

  const handleConnectExternal = async () => {
    if (!selectedProvider) return;

    // Validate credentials
    const validation = databaseConnector.validateCredentials(selectedProvider, credentials);
    if (!validation.valid) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/backend/provision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          backendType: 'external',
          config: {
            externalProvider: selectedProvider,
            credentials,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to connect backend');

      const result = await response.json();
      toast.success('Backend connected successfully!');
      onComplete(result);
    } catch (error) {
      toast.error('Failed to connect backend');
      console.error(error);
    }
  };

  const renderChoiceStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Database className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Backend</h2>
        <p className="text-gray-600">
          Select how you want to handle data for your application
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* JCAL Managed Backend */}
        <Card className="p-6 cursor-pointer hover:shadow-xl transition-all border-2 hover:border-blue-500">
          <div
            onClick={handleChooseManaged}
            className="h-full flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                RECOMMENDED
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">JCAL Managed Backend</h3>
            <p className="text-gray-600 mb-4 flex-1">
              Instant, fully managed Supabase backend. No setup required—we handle everything.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                One-click setup
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Automatic scaling
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Built-in security
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                No maintenance
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Get Started Instantly
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>

        {/* External Backend */}
        <Card className="p-6 cursor-pointer hover:shadow-xl transition-all border-2 hover:border-gray-400">
          <div
            onClick={handleChooseExternal}
            className="h-full flex flex-col"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <Server className="w-6 h-6 text-gray-700" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Bring Your Own Backend</h3>
            <p className="text-gray-600 mb-4 flex-1">
              Connect your existing database or cloud service. Full control over your infrastructure.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-gray-600 mr-2" />
                Use existing database
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-gray-600 mr-2" />
                Multiple providers
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-gray-600 mr-2" />
                Full data control
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-gray-600 mr-2" />
                Custom configuration
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Connect External Database
              <Settings className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>

      {onCancel && (
        <div className="text-center pt-4">
          <button onClick={onCancel} className="text-gray-600 hover:text-gray-800">
            Skip for now
          </button>
        </div>
      )}
    </div>
  );

  const renderManagedSetup = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Setting Up Your Backend</h2>
        <p className="text-gray-600">
          We'll automatically provision a secure, scalable backend for your app
        </p>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">What you'll get:</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">PostgreSQL Database</p>
              <p className="text-sm text-gray-600">Isolated schema with your project's tables</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Auto-Generated APIs</p>
              <p className="text-sm text-gray-600">RESTful endpoints for all your data</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Row-Level Security</p>
              <p className="text-sm text-gray-600">Your data is protected and isolated</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Real-Time Capabilities</p>
              <p className="text-sm text-gray-600">Live data updates when needed</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => setStep('choice')} className="flex-1">
          Back
        </Button>
        <Button onClick={handleProvisionManaged} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
          <Zap className="w-4 h-4 mr-2" />
          Provision Backend
        </Button>
      </div>
    </div>
  );

  const renderExternalSetup = () => {
    const provider = selectedProvider ? databaseConnector.getProvider(selectedProvider) : null;
    const popularProviders = databaseConnector.getPopularProviders();

    if (!selectedProvider) {
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <Server className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Connect Your Database</h2>
            <p className="text-gray-600">
              Choose your database provider to get started
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Popular Providers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularProviders.map((prov) => (
                <Card
                  key={prov.id}
                  className="p-4 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-500"
                  onClick={() => setSelectedProvider(prov.id)}
                >
                  <div className="flex items-start">
                    <div className="text-3xl mr-3">{prov.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{prov.name}</h4>
                      <p className="text-sm text-gray-600">{prov.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setStep('choice')}>
              Back
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => setSelectedProvider(null)}
              className="text-gray-600 hover:text-gray-800 mr-4"
            >
              ← Back
            </button>
            <div className="text-3xl mr-3">{provider?.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{provider?.name}</h2>
              <p className="text-gray-600">{provider?.description}</p>
            </div>
          </div>
        </div>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Connection Details</h3>
          <div className="space-y-4">
            {provider?.credentialFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={credentials[field.key] || ''}
                    onChange={(e) => setCredentials({ ...credentials, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={credentials[field.key] || ''}
                    onChange={(e) => setCredentials({ ...credentials, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                {field.helpText && (
                  <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {provider?.setupGuide && (
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Setup Guide</h4>
            <pre className="text-sm text-blue-800 whitespace-pre-wrap">{provider.setupGuide}</pre>
          </Card>
        )}

        {connectionStatus === 'success' && (
          <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <p className="text-green-800">Connection successful! Ready to connect.</p>
          </div>
        )}

        {connectionStatus === 'error' && (
          <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-red-800">Connection failed. Please check your credentials.</p>
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={testing}
            className="flex-1"
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button
            onClick={handleConnectExternal}
            disabled={connectionStatus !== 'success'}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Connect Database
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {step === 'choice' && renderChoiceStep()}
      {step === 'managed-setup' && renderManagedSetup()}
      {step === 'external-setup' && renderExternalSetup()}
    </div>
  );
}


