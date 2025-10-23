export default function EnvTestPage() {
  // This will show us if env vars are accessible
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Environment Variable Test</h1>
        
        <div className="space-y-4">
          <div>
            <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
              {supabaseUrl || '❌ NOT FOUND'}
            </pre>
          </div>
          
          <div>
            <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
              {supabaseKey ? `✅ Found (${supabaseKey.substring(0, 20)}...)` : '❌ NOT FOUND'}
            </pre>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> If these show as "NOT FOUND", restart your dev server:
            </p>
            <code className="block mt-2 p-2 bg-blue-100 rounded text-xs">
              Stop the server (Ctrl+C) and run: npm run dev
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

