'use client';

import { useState } from 'react';
import { TabNavigation, BuilderTab } from './TabNavigation';
import { OverviewTab } from './OverviewTab';
import { ChatTab } from './ChatTab';
import { ComponentsTab } from './ComponentsTab';

interface BuilderPaneProps {
  projectId: string;
  project: any;
  onProjectUpdate: (updates: any) => void;
  onStartBuild: () => void;
  isBuilding: boolean;
}

export function BuilderPane({
  projectId,
  project,
  onProjectUpdate,
  onStartBuild,
  isBuilding
}: BuilderPaneProps) {
  const [activeTab, setActiveTab] = useState<BuilderTab>('overview');
  const [chatHasActivity, setChatHasActivity] = useState(false);

  const handleTabChange = (tab: BuilderTab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tab Navigation - Always Visible */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        chatHasActivity={chatHasActivity}
      />

      {/* Tab Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'overview' && (
          <OverviewTab
            project={project}
            onProjectUpdate={onProjectUpdate}
            onStartBuild={onStartBuild}
            isBuilding={isBuilding}
          />
        )}

        {activeTab === 'chat' && (
          <ChatTab
            projectId={projectId}
            onBuildTriggered={() => setChatHasActivity(true)}
          />
        )}

        {activeTab === 'components' && (
          <ComponentsTab projectId={projectId} />
        )}
      </div>
    </div>
  );
}

