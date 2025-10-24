'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  Grid3x3, 
  Package, 
  Layout, 
  Navigation, 
  MessageSquare,
  Database,
  Copy,
  Check
} from 'lucide-react';
import { componentLibrary, ComponentTemplate } from '@/lib/component-templates';

const categoryIcons = {
  forms: Package,
  navigation: Navigation,
  'data-display': Database,
  feedback: MessageSquare,
  layout: Layout
};

export function ComponentLibrary({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ComponentTemplate['category'] | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: Array<{ id: ComponentTemplate['category'] | 'all'; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'forms', label: 'Forms' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'data-display', label: 'Data Display' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'layout', label: 'Layout' }
  ];

  const filteredComponents = componentLibrary.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || comp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyCode = (component: ComponentTemplate) => {
    navigator.clipboard.writeText(component.code);
    setCopiedId(component.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddToProject = async (component: ComponentTemplate) => {
    // TODO: Implement adding component to project
    console.log('Adding component to project:', component.id);
    handleCopyCode(component);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Grid3x3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Component Library</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Drag & drop pre-built components</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                           rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar - Categories */}
            <div className="w-64 bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-800 p-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.id === 'all' ? Grid3x3 : categoryIcons[category.id as keyof typeof categoryIcons];
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left
                        ${selectedCategory === category.id
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      <span className="font-medium">{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Content - Components Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredComponents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Grid3x3 className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No components found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search or category filter
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredComponents.map((component) => (
                    <ComponentCard
                      key={component.id}
                      component={component}
                      isCopied={copiedId === component.id}
                      onCopy={() => handleCopyCode(component)}
                      onAdd={() => handleAddToProject(component)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ComponentCard({ 
  component, 
  isCopied, 
  onCopy, 
  onAdd 
}: { 
  component: ComponentTemplate; 
  isCopied: boolean;
  onCopy: () => void;
  onAdd: () => void;
}) {
  const [showCode, setShowCode] = useState(false);

  return (
    <motion.div
      layout
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden
                 hover:shadow-lg transition-shadow"
    >
      {/* Preview */}
      <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 
                      flex items-center justify-center p-4">
        <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
          {component.name} Preview
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{component.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{component.description}</p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onAdd}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white 
                       rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium text-sm
                       flex items-center justify-center gap-2"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Code
              </>
            )}
          </button>
          <button
            onClick={() => setShowCode(!showCode)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
          >
            {showCode ? 'Hide' : 'View'} Code
          </button>
        </div>

        {/* Code Preview */}
        <AnimatePresence>
          {showCode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
              <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                <code>{component.code}</code>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
