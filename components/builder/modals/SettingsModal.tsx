'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Settings as SettingsIcon, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface SettingsModalProps {
  projectId: string;
  project: any;
  onClose: () => void;
  onUpdate?: (updates: any) => void;
}

export function SettingsModal({ projectId, project, onClose, onUpdate }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  
  const [generalSettings, setGeneralSettings] = useState({
    name: project?.name || '',
    description: project?.description || '',
    framework: project?.config?.framework || 'react'
  });

  const [deploymentSettings, setDeploymentSettings] = useState({
    buildCommand: project?.config?.buildCommand || 'npm run build',
    outputDir: project?.config?.outputDir || 'dist',
    envVars: project?.config?.envVars || ''
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          settings: {
            general: generalSettings,
            deployment: deploymentSettings
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to save settings');
      }

      toast.success('Settings saved successfully!');
      onUpdate?.(data.project);
      onClose();
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'deployment', label: 'Deployment', icon: '🚀' },
    { id: 'team', label: 'Team', icon: '👥' },
    { id: 'advanced', label: 'Advanced', icon: '🔧' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <SettingsIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Project Settings</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Configure your project</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content with Sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-gray-200 dark:border-gray-800 p-4 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 ${
                  activeTab === tab.id
                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">General Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Project Name *
                      </label>
                      <input
                        type="text"
                        value={generalSettings.name}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={generalSettings.description}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Framework
                      </label>
                      <select
                        value={generalSettings.framework}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, framework: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option value="react">React</option>
                        <option value="nextjs">Next.js</option>
                        <option value="vue">Vue.js</option>
                        <option value="svelte">Svelte</option>
                        <option value="angular">Angular</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'deployment' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Deployment Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Build Command
                      </label>
                      <input
                        type="text"
                        value={deploymentSettings.buildCommand}
                        onChange={(e) => setDeploymentSettings({ ...deploymentSettings, buildCommand: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm
                                 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Output Directory
                      </label>
                      <input
                        type="text"
                        value={deploymentSettings.outputDir}
                        onChange={(e) => setDeploymentSettings({ ...deploymentSettings, outputDir: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm
                                 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Environment Variables
                      </label>
                      <textarea
                        value={deploymentSettings.envVars}
                        onChange={(e) => setDeploymentSettings({ ...deploymentSettings, envVars: e.target.value })}
                        placeholder="KEY=value (one per line)"
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm
                                 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        One variable per line in KEY=value format
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Team Management</h3>
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">👥</div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Team collaboration coming soon!</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Invite team members and manage permissions
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Advanced Settings</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Project ID</h4>
                      <code className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                        {projectId}
                      </code>
                    </div>
                    
                    <div className="p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <h4 className="font-medium text-red-900 dark:text-red-400 mb-2">Danger Zone</h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                        Permanent actions cannot be undone
                      </p>
                      <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
                        Delete Project
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 
                     rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium
                     transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

