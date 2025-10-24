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
  PlayCircle,
  CheckSquare,
  ChevronDown,
  Lightbulb
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ComponentsTabProps {
  projectId: string;
}

// Component definitions with actual implementation templates
const COMPONENT_TEMPLATES = {
  // Layout Components
  'Header': {
    category: 'Layout',
    icon: Menu,
    description: 'Top navigation bar',
    code: `<header className="bg-white shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">Your Logo</h1>
      </div>
      <nav className="flex items-center space-x-4">
        <a href="#" className="text-gray-700 hover:text-gray-900">Home</a>
        <a href="#" className="text-gray-700 hover:text-gray-900">About</a>
        <a href="#" className="text-gray-700 hover:text-gray-900">Contact</a>
      </nav>
    </div>
  </div>
</header>`
  },
  'Footer': {
    category: 'Layout',
    icon: Menu,
    description: 'Bottom page footer',
    code: `<footer className="bg-gray-800 text-white mt-12">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-3 gap-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Company</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:underline">About</a></li>
          <li><a href="#" className="hover:underline">Contact</a></li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Product</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:underline">Features</a></li>
          <li><a href="#" className="hover:underline">Pricing</a></li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Legal</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:underline">Privacy</a></li>
          <li><a href="#" className="hover:underline">Terms</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
      © 2025 Your Company. All rights reserved.
    </div>
  </div>
</footer>`
  },
  'Sidebar': {
    category: 'Layout',
    icon: Layout,
    description: 'Side navigation panel',
    code: `<aside className="w-64 bg-gray-100 h-full p-6">
  <nav className="space-y-2">
    <a href="#" className="block px-4 py-2 rounded-lg bg-purple-600 text-white">Dashboard</a>
    <a href="#" className="block px-4 py-2 rounded-lg hover:bg-gray-200">Projects</a>
    <a href="#" className="block px-4 py-2 rounded-lg hover:bg-gray-200">Settings</a>
  </nav>
</aside>`
  },
  'Container': {
    category: 'Layout',
    icon: Square,
    description: 'Content wrapper',
    code: `<div className="container mx-auto px-4">
  {/* Your content here */}
</div>`
  },
  
  // Form Components
  'Input Field': {
    category: 'Forms',
    icon: Type,
    description: 'Text input',
    code: `<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Label
  </label>
  <input 
    type="text" 
    placeholder="Enter text..."
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
  />
</div>`
  },
  'Button': {
    category: 'Forms',
    icon: Square,
    description: 'Action button',
    code: `<button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
  Click Me
</button>`
  },
  'Checkbox': {
    category: 'Forms',
    icon: CheckSquare,
    description: 'Checkbox input',
    code: `<label className="flex items-center gap-2 cursor-pointer">
  <input type="checkbox" className="w-4 h-4 text-purple-600 rounded" />
  <span className="text-sm text-gray-700">I agree to the terms</span>
</label>`
  },
  'Select': {
    category: 'Forms',
    icon: ChevronDown,
    description: 'Dropdown select',
    code: `<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Select Option
  </label>
  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
  </select>
</div>`
  },
  
  // Data Display
  'Table': {
    category: 'Data Display',
    icon: Table,
    description: 'Data table',
    code: `<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      <tr>
        <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
        <td className="px-6 py-4 whitespace-nowrap">john@example.com</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>`
  },
  'Card': {
    category: 'Data Display',
    icon: Square,
    description: 'Content card',
    code: `<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">Card Title</h3>
  <p className="text-gray-600 mb-4">Card description goes here</p>
  <button className="text-purple-600 hover:text-purple-700 font-medium">Learn More →</button>
</div>`
  },
  'List': {
    category: 'Data Display',
    icon: List,
    description: 'Item list',
    code: `<ul className="space-y-2">
  <li className="p-3 bg-gray-50 rounded-lg">List item 1</li>
  <li className="p-3 bg-gray-50 rounded-lg">List item 2</li>
  <li className="p-3 bg-gray-50 rounded-lg">List item 3</li>
</ul>`
  },
  'Badge': {
    category: 'Data Display',
    icon: Square,
    description: 'Status badge',
    code: `<span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
  New
</span>`
  },
  
  // Media
  'Image': {
    category: 'Media',
    icon: Image,
    description: 'Image display',
    code: `<img 
  src="https://via.placeholder.com/400x300" 
  alt="Placeholder" 
  className="w-full h-auto rounded-lg shadow-md"
/>`
  },
  'Video': {
    category: 'Media',
    icon: PlayCircle,
    description: 'Video player',
    code: `<video 
  controls 
  className="w-full rounded-lg shadow-md"
>
  <source src="your-video.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>`
  }
};

export function ComponentsTab({ projectId }: ComponentsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Group components by category
  const categories = Object.entries(COMPONENT_TEMPLATES).reduce((acc, [name, component]) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push({ name, ...component });
    return acc;
  }, {} as Record<string, any[]>);

  const handleAddComponent = async (componentName: string, componentData: any) => {
    if (isAdding) return;
    
    setIsAdding(true);
    try {
      const response = await fetch('/api/components/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          component: {
            name: componentName,
            category: componentData.category,
            code: componentData.code
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to add component');
      }

      toast.success(`${componentName} added to your project!`);
    } catch (error: any) {
      console.error('Error adding component:', error);
      toast.error(error.message || 'Failed to add component');
    } finally {
      setIsAdding(false);
    }
  };

  const filteredCategories = Object.entries(categories).reduce((acc, [category, components]) => {
    const filtered = components.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, any[]>);

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
        {Object.entries(filteredCategories).map(([category, components]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">{category}</h3>
            
            <div className="grid grid-cols-2 gap-3">
              {components.map((component) => {
                const ComponentIcon = component.icon;
                
                return (
                  <motion.button
                    key={component.name}
                    onClick={() => handleAddComponent(component.name, component)}
                    disabled={isAdding}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-start gap-3 p-4 border-2 border-gray-200
                             rounded-lg hover:border-purple-500 hover:shadow-md
                             transition-all duration-200 text-left bg-white
                             disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                      <ComponentIcon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">{component.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{component.description}</div>
                      <div className="text-xs text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                        Click to add →
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Pro Tip */}
      <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-purple-900 mb-1">Pro Tip</div>
            <div className="text-sm text-purple-700">
              Click any component to add it to your project. You can customize it using the AI Chat by saying
              "modify the button to be green" or similar commands!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
