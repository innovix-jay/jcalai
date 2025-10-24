'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FilePlus, 
  Package, 
  Database, 
  Settings,
  Save,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AddPageModal } from './modals/AddPageModal';
import { PlaceholderModal } from './modals/PlaceholderModal';
import { DatabaseModal } from './modals/DatabaseModal';
import { SettingsModal } from './modals/SettingsModal';

interface OverviewTabProps {
  project: any;
  onProjectUpdate: (updates: any) => void;
  onStartBuild: () => void;
  isBuilding: boolean;
}

export function OverviewTab({
  project,
  onProjectUpdate,
  onStartBuild,
  isBuilding
}: OverviewTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [status, setStatus] = useState(project?.status || 'planning');
  const [isSaving, setIsSaving] = useState(false);
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [showComponentModal, setShowComponentModal] = useState(false);
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onProjectUpdate({
        name,
        description,
        status
      });
      toast.success('Project updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update project');
    } finally {
      setIsSaving(false);
    }
  };

  const quickActions = [
    {
      id: 'add-page',
      icon: FilePlus,
      title: 'Add Page',
      description: 'Create new page',
      color: 'blue',
      onClick: () => {
        setShowAddPageModal(true);
      }
    },
    {
      id: 'add-component',
      icon: Package,
      title: 'Add Component',
      description: 'Insert UI element',
      color: 'purple',
      onClick: () => {
        setShowComponentModal(true);
      }
    },
    {
      id: 'database',
      icon: Database,
      title: 'Database',
      description: 'Setup data models',
      color: 'green',
      onClick: () => {
        setShowDatabaseModal(true);
      }
    },
    {
      id: 'settings',
      icon: Settings,
      title: 'Settings',
      description: 'Project config',
      color: 'gray',
      onClick: () => {
        setShowSettingsModal(true);
      }
    }
  ];

  const statusOptions = [
    { value: 'planning', label: 'Planning', color: 'yellow' },
    { value: 'in-progress', label: 'In Progress', color: 'blue' },
    { value: 'testing', label: 'Testing', color: 'purple' },
    { value: 'completed', label: 'Completed', color: 'green' }
  ];

  const currentStatus = statusOptions.find(s => s.value === status);

  return (
    <div className="p-6 space-y-6">
      {/* Project Overview Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Project Overview</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Edit
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                maxLength={50}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all"
              />
            ) : (
              <p className="text-base text-gray-900">{name || 'Untitled Project'}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            {isEditing ? (
              <div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none
                           focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {description.length}/500 characters
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                {description || 'No description provided'}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            {isEditing ? (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-2">
                <span className={`
                  inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                  ${currentStatus?.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${currentStatus?.color === 'blue' ? 'bg-blue-100 text-blue-800' : ''}
                  ${currentStatus?.color === 'purple' ? 'bg-purple-100 text-purple-800' : ''}
                  ${currentStatus?.color === 'green' ? 'bg-green-100 text-green-800' : ''}
                `}>
                  {currentStatus?.label}
                </span>
              </div>
            )}
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700
                         text-white rounded-lg font-medium transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </motion.button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setName(project?.name || '');
                  setDescription(project?.description || '');
                  setStatus(project?.status || 'planning');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg
                         hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className="group relative h-24 border-2 border-gray-200 rounded-lg p-4
                         hover:border-purple-500 hover:shadow-md transition-all duration-200
                         text-left bg-white"
              >
                <Icon className="w-8 h-8 mb-2 text-gray-600 group-hover:text-purple-600 transition-colors" />
                <div className="text-sm font-medium text-gray-900">{action.title}</div>
                <div className="text-xs text-gray-500">{action.description}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Changes</h3>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-sm text-gray-500 text-center py-8">
            No recent activity
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddPageModal && (
          <AddPageModal
            projectId={project?.id}
            onClose={() => setShowAddPageModal(false)}
            onPageAdded={(page) => {
              // Optionally refresh project data or show success message
              console.log('Page added:', page);
            }}
          />
        )}
        {showComponentModal && (
          <PlaceholderModal
            title="Add Component"
            description="Insert a new UI component"
            onClose={() => setShowComponentModal(false)}
          />
        )}
        {showDatabaseModal && (
          <DatabaseModal
            projectId={project?.id}
            onClose={() => setShowDatabaseModal(false)}
          />
        )}
        {showSettingsModal && (
          <SettingsModal
            projectId={project?.id}
            project={project}
            onClose={() => setShowSettingsModal(false)}
            onUpdate={(updates) => {
              onProjectUpdate(updates);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

