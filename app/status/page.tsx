'use client';

export default function StatusPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="bg-white rounded-lg shadow-2xl p-12 max-w-2xl text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          ✅ Server is Running!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Your JCAL.ai development server is operational.
        </p>
        
        <div className="space-y-4 text-left bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🌐</span>
            <div>
              <strong className="block text-sm text-gray-500">Server Status</strong>
              <span className="text-lg text-gray-900">Online</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-2xl">⚡</span>
            <div>
              <strong className="block text-sm text-gray-500">Port</strong>
              <span className="text-lg text-gray-900">
                {typeof window !== 'undefined' ? window.location.port || '3000' : '3000/3001'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🔧</span>
            <div>
              <strong className="block text-sm text-gray-500">Environment</strong>
              <span className="text-lg text-gray-900">Development</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 space-y-3">
          <a 
            href="/test-ai"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            🤖 Test AI Assistant
          </a>
          
          <a 
            href="/dashboard"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            📊 Go to Dashboard
          </a>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Next.js 14.2.33 • React 18 • JCAL.ai v1.0.0</p>
        </div>
      </div>
    </div>
  );
}

