'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, MessageSquare, Package } from 'lucide-react';

export type BuilderTab = 'overview' | 'chat' | 'components';

interface TabNavigationProps {
  activeTab: BuilderTab;
  onTabChange: (tab: BuilderTab) => void;
  chatHasActivity?: boolean;
}

export function TabNavigation({ activeTab, onTabChange, chatHasActivity = false }: TabNavigationProps) {
  const tabs = [
    {
      id: 'overview' as BuilderTab,
      label: 'Overview',
      icon: LayoutDashboard,
      description: 'Project details and quick actions'
    },
    {
      id: 'chat' as BuilderTab,
      label: 'AI Chat',
      icon: MessageSquare,
      description: 'Build with AI assistance',
      badge: chatHasActivity
    },
    {
      id: 'components' as BuilderTab,
      label: 'Components',
      icon: Package,
      description: 'Component library'
    }
  ];

  return (
    <div className="flex border-b border-gray-200 bg-white">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative flex items-center gap-2 px-6 py-3
              border-b-2 transition-all duration-200
              ${isActive
                ? 'border-purple-600 bg-purple-50 text-purple-700'
                : 'border-transparent hover:bg-gray-50 text-gray-600 hover:text-gray-900'
              }
            `}
            title={tab.description}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium text-sm">{tab.label}</span>
            
            {tab.badge && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-green-500 rounded-full"
              />
            )}

            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                transition={{ duration: 0.2 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

