'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database, Table, Code, Plug, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackendPanelProps {
  project: any;
}

export function BackendPanel({ project }: BackendPanelProps) {
  const [activeTab, setActiveTab] = useState<'database' | 'api' | 'integrations'>('database');
  const [databaseSchemas, setDatabaseSchemas] = useState<any[]>([]);
  const [apiEndpoints, setApiEndpoints] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBackendData();
  }, [project, loadBackendData]);

  const loadBackendData = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);

    try {
      // Load database schemas
      const { data: schemasData } = await supabase
        .from('database_schemas')
        .select('*')
        .eq('project_id', project.id);
      
      setDatabaseSchemas(schemasData || []);

      // Load API endpoints
      const { data: endpointsData } = await supabase
        .from('api_endpoints')
        .select('*')
        .eq('project_id', project.id);
      
      setApiEndpoints(endpointsData || []);

      // Load integrations
      const { data: integrationsData } = await supabase
        .from('integrations')
        .select('*')
        .eq('project_id', project.id);
      
      setIntegrations(integrationsData || []);
    } catch (error) {
      console.error('Error loading backend data:', error);
    } finally {
      setLoading(false);
    }
  }, [project]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Tabs */}
      <div className="border-b border-gray-200 flex">
        <button
          onClick={() => setActiveTab('database')}
          className={`px-6 py-3 text-sm font-medium ${
            activeTab === 'database'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Database className="w-4 h-4 inline-block mr-2" />
          Database
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`px-6 py-3 text-sm font-medium ${
            activeTab === 'api'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Code className="w-4 h-4 inline-block mr-2" />
          API Endpoints
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-6 py-3 text-sm font-medium ${
            activeTab === 'integrations'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Plug className="w-4 h-4 inline-block mr-2" />
          Integrations
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'database' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Database Schemas</h2>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Table
                  </Button>
                </div>

                {databaseSchemas.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Table className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No database tables yet</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Use the AI assistant to generate your database schema
                    </p>
                    <Button size="sm">Create First Table</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {databaseSchemas.map((schema) => (
                      <div key={schema.id} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">{schema.name}</h3>
                        <div className="space-y-2">
                          {schema.tables?.map((table: any, idx: number) => (
                            <div key={idx} className="bg-gray-50 rounded p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-700">{table.name}</span>
                                <span className="text-xs text-gray-500">
                                  {table.columns?.length || 0} columns
                                </span>
                              </div>
                              <div className="text-xs text-gray-600 space-y-1">
                                {table.columns?.map((column: any, colIdx: number) => (
                                  <div key={colIdx} className="flex items-center space-x-2">
                                    <span className="font-mono">{column.name}</span>
                                    <span className="text-gray-400">:</span>
                                    <span className="text-blue-600">{column.type}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'api' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">API Endpoints</h2>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Endpoint
                  </Button>
                </div>

                {apiEndpoints.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No API endpoints yet</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Use the AI assistant to generate your API
                    </p>
                    <Button size="sm">Create First Endpoint</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {apiEndpoints.map((endpoint) => (
                      <div
                        key={endpoint.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded ${
                                endpoint.method === 'GET'
                                  ? 'bg-green-100 text-green-700'
                                  : endpoint.method === 'POST'
                                  ? 'bg-blue-100 text-blue-700'
                                  : endpoint.method === 'PUT'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {endpoint.method}
                            </span>
                            <code className="text-sm font-mono text-gray-700">{endpoint.path}</code>
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                        {endpoint.description && (
                          <p className="text-sm text-gray-600 mt-2">{endpoint.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'integrations' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Integrations</h2>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Integration
                  </Button>
                </div>

                {integrations.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Plug className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No integrations yet</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Connect third-party services like Stripe, SendGrid, and more
                    </p>
                    <Button size="sm">Browse Integrations</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {integrations.map((integration) => (
                      <div
                        key={integration.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-800">{integration.service_name}</h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${
                              integration.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {integration.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{integration.service_type}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


