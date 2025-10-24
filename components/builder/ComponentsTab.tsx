'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Layout, 
  Type, 
  Square, 
  List, 
  Table, 
  Menu, 
  Image,
  PlayCircle
} from 'lucide-react';

interface ComponentsTabProps {
  projectId: string;
}

export function ComponentsTab({ projectId }: ComponentsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      title: 'Layout',
      icon: Layout,
      components: [
        { name: 'Header', icon: Menu, description: 'Top navigation bar' },
        { name: 'Footer', icon: Menu, description: 'Bottom page footer' },
        { name: 'Sidebar', icon: Layout, description: 'Side navigation panel' },
        { name: 'Container', icon: Square, description: 'Content wrapper' }
      ]
    },
    {
      title: 'Forms',
      icon: Type,
      components: [
        { name: 'Input Field', icon: Type, description: 'Text input' },
        { name: 'Button', icon: Square, description: 'Action button' },
        { name: 'Checkbox', icon: Square, description: 'Checkbox input' },
        { name: 'Select', icon: List, description: 'Dropdown select' }
      ]
    },
    {
      title: 'Data Display',
      icon: Table,
      components: [
        { name: 'Table', icon: Table, description: 'Data table' },
        { name: 'Card', icon: Square, description: 'Content card' },
        { name: 'List', icon: List, description: 'Item list' },
        { name: 'Badge', icon: Square, description: 'Status badge' }
      ]
    },
    {
      title: 'Media',
      icon: Image,
      components: [
        { name: 'Image', icon: Image, description: 'Image display' },
        { name: 'Video', icon: PlayCircle, description: 'Video player' }
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search components..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                   focus:ring-2 focus:ring-purple-500 focus:border-transparent
                   transition-all"
        />
      </div>

      {/* Component Library */}
      <div className="space-y-6">
        {categories.map((category) => {
          const CategoryIcon = category.icon;
          
          return (
            <div key={category.title}>
              <div className="flex items-center gap-2 mb-3">
                <CategoryIcon className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {category.components.map((component) => {
                  const ComponentIcon = component.icon;
                  
                  return (
                    <motion.button
                      key={component.name}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-start gap-3 p-4 border-2 border-gray-200
                               rounded-lg hover:border-purple-500 hover:shadow-md
                               transition-all duration-200 text-left bg-white"
                    >
                      <ComponentIcon className="w-6 h-6 text-gray-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{component.name}</div>
                        <div className="text-xs text-gray-500">{component.description}</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mt-6">
        <p className="text-sm text-purple-900">
          <strong>Coming Soon:</strong> Drag components directly into your preview or use AI Chat to add them!
        </p>
      </div>
    </div>
  );
}

