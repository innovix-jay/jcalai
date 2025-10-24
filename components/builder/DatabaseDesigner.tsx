'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function DatabaseDesigner({ projectId }: { projectId: string }) {
  const [description, setDescription] = useState('');
  const [schema, setSchema] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSchema = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/database/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, description })
      });
      const data = await response.json();
      setSchema(data.schema);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Smart Database Designer</h2>

      {/* Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Describe your data structure
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Example: I need to store users with profiles, posts with comments, and likes"
          className="w-full h-32 px-4 py-3 border rounded-lg resize-none"
        />
        <button
          onClick={generateSchema}
          disabled={isGenerating || !description}
          className="mt-3 px-6 py-2 bg-indigo-600 text-white rounded-lg"
        >
          {isGenerating ? 'Designing...' : '🧠 Design Schema'}
        </button>
      </div>

      {/* Schema Visualization */}
      {schema && (
        <div className="space-y-6">
          {/* ER Diagram */}
          <div className="p-6 border rounded-xl">
            <h3 className="font-semibold mb-4">Entity Relationship Diagram</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm">{schema.diagram}</pre>
            </div>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-2 gap-4">
            {schema.tables.map((table: any, i: number) => (
              <div key={i} className="p-4 border rounded-xl">
                <h4 className="font-semibold mb-3">{table.name}</h4>
                <div className="space-y-2">
                  {table.columns.map((col: any, j: number) => (
                    <div key={j} className="flex items-center justify-between text-sm">
                      <span className="font-mono">{col.name}</span>
                      <span className="text-gray-500">{col.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
              ✅ Apply Schema
            </button>
            <button className="px-4 py-2 border rounded-lg">
              🎲 Generate Sample Data
            </button>
            <button className="px-4 py-2 border rounded-lg">
              📥 Export SQL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
