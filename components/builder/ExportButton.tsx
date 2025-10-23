'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2, CheckCircle } from 'lucide-react';
import { CodeExporter } from '@/services/code-exporter';

export function ExportButton({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      });

      const blob = await response.blob();
      
      // Download file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleExport}
      disabled={isExporting}
      className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                 rounded-lg font-medium flex items-center gap-2 
                 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : exportSuccess ? (
        <CheckCircle className="w-4 h-4 text-green-600" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {isExporting ? 'Exporting...' : exportSuccess ? 'Downloaded!' : 'Export Code'}
    </motion.button>
  );
}
