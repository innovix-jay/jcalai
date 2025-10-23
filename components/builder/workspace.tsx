'use client';

import { useEditor, Frame, Element } from '@craftjs/core';

export function BuilderWorkspace() {
  const { connectors, actions } = useEditor();

  return (
    <div
      ref={(ref) => { 
        if (ref) connectors.create(ref);
      }}
      className="h-full bg-white"
      onDrop={(e) => {
        e.preventDefault();
        const componentData = e.dataTransfer.getData('component');
        if (componentData) {
          const component = JSON.parse(componentData);
          console.log('Dropped component:', component);
          // Handle component drop
        }
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <Frame>
        <Element
          canvas
          is="div"
          className="min-h-screen p-8"
        >
          {/* This is where the drag-and-drop canvas will be */}
          <div className="text-center text-gray-400 py-20">
            <p className="text-lg font-medium mb-2">Start building your app</p>
            <p className="text-sm">Drag and drop components from the left sidebar</p>
          </div>
        </Element>
      </Frame>
    </div>
  );
}


