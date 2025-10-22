'use client';

import { useState } from 'react';
import {
  Layout,
  Type,
  Image,
  Square,
  List,
  Table,
  FileText,
  Navigation,
  Layers,
  Component,
  Database,
  Code,
  Puzzle,
} from 'lucide-react';

interface BuilderSidebarProps {
  project: any;
}

export function BuilderSidebar({ project }: BuilderSidebarProps) {
  const [activeTab, setActiveTab] = useState<'components' | 'layers' | 'pages'>('components');

  const componentCategories = [
    {
      name: 'Layout',
      icon: Layout,
      components: [
        { name: 'Container', icon: Square, description: 'Basic container' },
        { name: 'Grid', icon: Layout, description: '2, 3, or 4 column grid' },
        { name: 'Flex', icon: Layout, description: 'Flexible layout' },
        { name: 'Card', icon: Square, description: 'Card component' },
      ],
    },
    {
      name: 'Content',
      icon: FileText,
      components: [
        { name: 'Text', icon: Type, description: 'Text block' },
        { name: 'Heading', icon: Type, description: 'Heading (H1-H6)' },
        { name: 'Image', icon: Image, description: 'Image element' },
        { name: 'Hero', icon: Layout, description: 'Hero section' },
      ],
    },
    {
      name: 'Forms',
      icon: List,
      components: [
        { name: 'Input', icon: Type, description: 'Text input' },
        { name: 'Button', icon: Square, description: 'Button element' },
        { name: 'Form', icon: List, description: 'Form container' },
        { name: 'Select', icon: List, description: 'Dropdown select' },
      ],
    },
    {
      name: 'Navigation',
      icon: Navigation,
      components: [
        { name: 'Navbar', icon: Navigation, description: 'Navigation bar' },
        { name: 'Footer', icon: Navigation, description: 'Footer section' },
        { name: 'Sidebar', icon: Navigation, description: 'Side navigation' },
        { name: 'Tabs', icon: Layers, description: 'Tab component' },
      ],
    },
    {
      name: 'Data Display',
      icon: Table,
      components: [
        { name: 'Table', icon: Table, description: 'Data table' },
        { name: 'List', icon: List, description: 'List component' },
        { name: 'Chart', icon: Table, description: 'Chart/Graph' },
        { name: 'Stats', icon: Table, description: 'Statistics display' },
      ],
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Tabs */}
      <div className="border-b border-gray-200 flex">
        <button
          onClick={() => setActiveTab('components')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'components'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Component className="w-4 h-4 inline-block mr-2" />
          Components
        </button>
        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'layers'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Layers className="w-4 h-4 inline-block mr-2" />
          Layers
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'components' && (
          <div className="space-y-6">
            {componentCategories.map((category) => (
              <div key={category.name}>
                <div className="flex items-center space-x-2 mb-3">
                  <category.icon className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-700">{category.name}</h3>
                </div>
                <div className="space-y-1">
                  {category.components.map((component) => (
                    <div
                      key={component.name}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('component', JSON.stringify(component));
                      }}
                      className="group flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-move transition-colors"
                    >
                      <component.icon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          {component.name}
                        </p>
                        <p className="text-xs text-gray-500">{component.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="space-y-2">
            <div className="text-sm text-gray-500">
              Layers panel will show the component hierarchy here.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


