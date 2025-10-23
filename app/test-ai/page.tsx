'use client';

import { useState } from 'react';
import { generateAI } from '@/lib/ai/client-ai';
import type { AIProvider } from '@/lib/ai/model-router';

export default function TestAIPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<AIProvider>('gemini');

  const testAPI = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      console.log('Testing AI with model:', selectedModel);
      const response = await generateAI(
        'Say hello and introduce yourself in one sentence.',
        'general',
        selectedModel
      );

      setResult(`✅ SUCCESS!\n\nModel: ${response.model}\nProvider: ${response.provider}\nTokens: ${response.tokensUsed}\nCost: $${response.cost.toFixed(6)}\n\nResponse:\n${response.response}`);
    } catch (err: any) {
      console.error('Test failed:', err);
      setError(`❌ ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 AI API Test Page</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test AI Connection</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Model:</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as AIProvider)}
              className="w-full border rounded px-3 py-2"
              disabled={loading}
            >
              <option value="auto">🤖 Auto Select</option>
              <option value="gemini">⚡ Gemini 1.5 Flash (Recommended - Fast & Free)</option>
              <option value="gemini-pro">💎 Gemini 2.5 Pro (Reasoning & Code)</option>
              <option value="claude">🧠 Claude 4.5 Sonnet</option>
              <option value="openai">💬 GPT-5</option>
            </select>
          </div>

          <button
            onClick={testAPI}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Testing...' : 'Test API Connection'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
              <pre className="text-red-700 whitespace-pre-wrap">{error}</pre>
            </div>
          )}

          {result && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              <pre className="text-green-700 whitespace-pre-wrap">{result}</pre>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold mb-2">📋 Debug Checklist:</h3>
          <ul className="space-y-2 text-sm">
            <li>✅ Open browser console (F12) to see detailed logs</li>
            <li>✅ Check if API keys are loaded (look for [Model Router] logs)</li>
            <li>✅ Look for error messages in console</li>
            <li>✅ Verify which model is being selected</li>
            <li>✅ Check if API calls are being made</li>
          </ul>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold mb-2">⚡ Quick Tips:</h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Gemini</strong> is the best to start with (free tier, fast)</li>
            <li>• If one model fails, try another</li>
            <li>• Check console for detailed error messages</li>
            <li>• Make sure dev server was restarted after adding .env.local</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

