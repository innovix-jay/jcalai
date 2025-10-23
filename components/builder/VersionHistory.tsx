'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  X, 
  RotateCcw, 
  Clock, 
  User,
  GitBranch,
  Check,
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface ProjectVersion {
  id: string;
  version_number: number;
  version_tag: string;
  commit_message: string;
  is_auto_save: boolean;
  created_at: string;
  changes_summary?: string;
}

export function VersionHistory({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  useEffect(() => {
    fetchVersions();
  }, [projectId]);

  const fetchVersions = async () => {
    const supabase = createClient();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('project_versions')
        .select('*')
        .eq('project_id', projectId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (versionId: string) => {
    setRestoringId(versionId);

    try {
      const supabase = createClient();
      
      // Call restore function
      const { data, error } = await supabase.rpc('restore_project_version', {
        p_version_id: versionId
      });

      if (error) throw error;

      // Reload page to show restored version
      window.location.reload();
    } catch (error) {
      console.error('Error restoring version:', error);
    } finally {
      setRestoringId(null);
    }
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
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <History className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Version History</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Restore any previous version</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Versions List */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : versions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <GitBranch className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No versions yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Version history will appear here as you make changes
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {versions.map((version, index) => (
                  <VersionItem
                    key={version.id}
                    version={version}
                    isLatest={index === 0}
                    isRestoring={restoringId === version.id}
                    onRestore={() => handleRestore(version.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function VersionItem({ 
  version, 
  isLatest, 
  isRestoring, 
  onRestore 
}: { 
  version: ProjectVersion; 
  isLatest: boolean; 
  isRestoring: boolean; 
  onRestore: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border ${
        isLatest 
          ? 'border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20'
          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              isLatest 
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}>
              {version.version_tag}
            </span>
            {isLatest && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                Current
              </span>
            )}
            {version.is_auto_save && (
              <span className="text-xs text-gray-500">Auto-save</span>
            )}
          </div>

          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {version.commit_message}
          </p>

          {version.changes_summary && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              {version.changes_summary}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>

        {!isLatest && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestore}
            disabled={isRestoring}
            className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                       disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
          >
            {isRestoring ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            Restore
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
