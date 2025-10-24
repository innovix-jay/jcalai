'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Layout, ShoppingCart, User, Mail, Home, Settings as SettingsIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddPageModalProps {
  projectId: string;
  onClose: () => void;
  onPageAdded?: (page: any) => void;
}

const PAGE_TEMPLATES = [
  { id: 'blank', name: 'Blank Page', icon: FileText, description: 'Start from scratch' },
  { id: 'home', name: 'Home Page', icon: Home, description: 'Landing page with hero section' },
  { id: 'about', name: 'About Page', icon: User, description: 'Company or personal info' },
  { id: 'contact', name: 'Contact Page', icon: Mail, description: 'Contact form and details' },
  { id: 'products', name: 'Products Page', icon: ShoppingCart, description: 'Product listing grid' },
  { id: 'dashboard', name: 'Dashboard', icon: Layout, description: 'Admin/user dashboard' },
  { id: 'settings', name: 'Settings Page', icon: SettingsIcon, description: 'User settings panel' }
];

export function AddPageModal({ projectId, onClose, onPageAdded }: AddPageModalProps) {
  const [pageName, setPageName] = useState('');
  const [pagePath, setPagePath] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('blank');
  const [isCreating, setIsCreating] = useState(false);

  const handlePageNameChange = (name: string) => {
    setPageName(name);
    // Auto-generate path from name
    const path = '/' + name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setPagePath(path);
  };

  const handleCreatePage = async () => {
    if (!pageName.trim()) {
      toast('Please enter a page name', { icon: '⚠️' });
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/pages/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          name: pageName,
          path: pagePath,
          template: selectedTemplate
        })
      });

      if (!response.ok) throw new Error('Failed to create page');

      const newPage = await response.json();
      toast.success(`Page "${pageName}" created successfully!`);
      onPageAdded?.(newPage);
      onClose();
    } catch (error) {
      console.error('Error creating page:', error);
      toast.error('Failed to create page. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

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
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add New Page</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create a new page for your app</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Page Details */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Page Name
              </label>
              <input
                type="text"
                value={pageName}
                onChange={(e) => handlePageNameChange(e.target.value)}
                placeholder="e.g., About Us"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Page Path
              </label>
              <input
                type="text"
                value={pagePath}
                onChange={(e) => setPagePath(e.target.value)}
                placeholder="/about-us"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                The URL path where this page will be accessible
              </p>
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose Template
            </label>
            <div className="grid grid-cols-2 gap-3">
              {PAGE_TEMPLATES.map((template) => {
                const Icon = template.icon;
                const isSelected = selectedTemplate === template.id;
                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium mb-1 ${
                          isSelected 
                            ? 'text-purple-700 dark:text-purple-300' 
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {template.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreatePage}
            disabled={isCreating || !pageName.trim()}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium
                     transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isCreating ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </>
            ) : (
              'Create Page'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

