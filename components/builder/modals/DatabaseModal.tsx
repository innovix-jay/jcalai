'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, Database as DatabaseIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface DatabaseModalProps {
  projectId: string;
  onClose: () => void;
}

interface Field {
  name: string;
  type: string;
  nullable: boolean;
  unique: boolean;
}

interface Table {
  name: string;
  fields: Field[];
}

const FIELD_TYPES = [
  'string',
  'number',
  'boolean',
  'date',
  'text',
  'email',
  'url',
  'json'
];

export function DatabaseModal({ projectId, onClose }: DatabaseModalProps) {
  const [dbType, setDbType] = useState('postgresql');
  const [tables, setTables] = useState<Table[]>([]);
  const [newTable, setNewTable] = useState<Table>({ name: '', fields: [] });
  const [isSaving, setIsSaving] = useState(false);

  const handleAddField = () => {
    setNewTable({
      ...newTable,
      fields: [...newTable.fields, { name: '', type: 'string', nullable: false, unique: false }]
    });
  };

  const handleUpdateField = (index: number, field: Partial<Field>) => {
    const updatedFields = [...newTable.fields];
    updatedFields[index] = { ...updatedFields[index], ...field };
    setNewTable({ ...newTable, fields: updatedFields });
  };

  const handleRemoveField = (index: number) => {
    setNewTable({
      ...newTable,
      fields: newTable.fields.filter((_, i) => i !== index)
    });
  };

  const handleCreateTable = async () => {
    if (!newTable.name.trim()) {
      toast('Please enter a table name', { icon: '⚠️' });
      return;
    }

    if (newTable.fields.length === 0) {
      toast('Please add at least one field', { icon: '⚠️' });
      return;
    }

    // Validate field names
    const emptyFields = newTable.fields.filter(f => !f.name.trim());
    if (emptyFields.length > 0) {
      toast('All fields must have names', { icon: '⚠️' });
      return;
    }

    try {
      const response = await fetch('/api/database/create-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          name: newTable.name,
          fields: newTable.fields
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to create table');
      }

      setTables([...tables, newTable]);
      setNewTable({ name: '', fields: [] });
      toast.success(`Table "${newTable.name}" created successfully!`);
    } catch (error: any) {
      console.error('Error creating table:', error);
      toast.error(error.message || 'Failed to create table');
    }
  };

  const handleSaveConfiguration = async () => {
    if (tables.length === 0) {
      toast('Please create at least one table', { icon: '⚠️' });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/database/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          dbType,
          tables
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to save configuration');
      }

      toast.success('Database configuration saved!');
      onClose();
    } catch (error: any) {
      console.error('Error saving configuration:', error);
      toast.error(error.message || 'Failed to save configuration');
    } finally {
      setIsSaving(false);
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
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DatabaseIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Database Configuration</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Define your data models</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Database Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Database Type
            </label>
            <select
              value={dbType}
              onChange={(e) => setDbType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="postgresql">PostgreSQL (Recommended)</option>
              <option value="mongodb">MongoDB</option>
              <option value="mysql">MySQL</option>
              <option value="sqlite">SQLite</option>
            </select>
          </div>

          {/* Add New Table Section */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Create New Table</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Table Name
                </label>
                <input
                  type="text"
                  value={newTable.name}
                  onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
                  placeholder="e.g., users, posts, products"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fields
                  </label>
                  <button
                    onClick={handleAddField}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-50 dark:bg-green-900/20 
                             text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 
                             transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Field
                  </button>
                </div>

                {newTable.fields.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                    No fields yet. Click "Add Field" to start building your table.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {newTable.fields.map((field, index) => (
                      <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Field name"
                            value={field.name}
                            onChange={(e) => handleUpdateField(index, { name: e.target.value })}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm
                                     bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                     focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          <select
                            value={field.type}
                            onChange={(e) => handleUpdateField(index, { type: e.target.value })}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm
                                     bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                     focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            {FIELD_TYPES.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                            <input
                              type="checkbox"
                              checked={field.nullable}
                              onChange={(e) => handleUpdateField(index, { nullable: e.target.checked })}
                              className="rounded"
                            />
                            Null
                          </label>
                          <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                            <input
                              type="checkbox"
                              checked={field.unique}
                              onChange={(e) => handleUpdateField(index, { unique: e.target.checked })}
                              className="rounded"
                            />
                            Unique
                          </label>
                        </div>
                        <button
                          onClick={() => handleRemoveField(index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleCreateTable}
                disabled={!newTable.name || newTable.fields.length === 0}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium
                         transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Table
              </button>
            </div>
          </div>

          {/* Existing Tables */}
          {tables.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Created Tables</h3>
              <div className="space-y-3">
                {tables.map((table, index) => (
                  <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{table.name}</h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {table.fields.length} field{table.fields.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {table.fields.map((field, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-2 text-sm">
                          <span className="font-mono text-gray-900 dark:text-gray-100">{field.name}</span>
                          <span className="text-gray-500 dark:text-gray-400">:</span>
                          <span className="text-gray-600 dark:text-gray-300">{field.type}</span>
                          {field.unique && (
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded">
                              unique
                            </span>
                          )}
                          {field.nullable && (
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded">
                              nullable
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            onClick={handleSaveConfiguration}
            disabled={isSaving || tables.length === 0}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium
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
              'Save Configuration'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}


