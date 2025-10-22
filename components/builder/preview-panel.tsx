'use client';

import { useState } from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { Editor, Frame, Element } from '@craftjs/core';
import { Container } from '@/components/craft/container';
import { Text } from '@/components/craft/text';
import { Button as CraftButton } from '@/components/craft/button';
import { Hero } from '@/components/craft/hero';

interface PreviewPanelProps {
  project: any;
  currentPage: any;
}

export function PreviewPanel({ project, currentPage }: PreviewPanelProps) {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const viewportSizes = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]',
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Viewport Switcher */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-center space-x-2">
        <button
          onClick={() => setViewport('desktop')}
          className={`p-2 rounded-lg ${
            viewport === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Desktop"
        >
          <Monitor className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewport('tablet')}
          className={`p-2 rounded-lg ${
            viewport === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Tablet"
        >
          <Tablet className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewport('mobile')}
          className={`p-2 rounded-lg ${
            viewport === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Mobile"
        >
          <Smartphone className="w-5 h-5" />
        </button>
        <div className="mx-4 h-6 w-px bg-gray-300" />
        <span className="text-sm text-gray-600">
          {viewport === 'desktop' && '1920px'}
          {viewport === 'tablet' && '768px'}
          {viewport === 'mobile' && '375px'}
        </span>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto p-8">
        <div className={`mx-auto ${viewportSizes[viewport]} transition-all duration-300`}>
          <div className="bg-white shadow-xl rounded-lg overflow-hidden min-h-[600px]">
            <Editor
              resolver={{
                Container,
                Text,
                Button: CraftButton,
                Hero,
              }}
            >
              <Frame data={currentPage?.structure}>
                <Element canvas is={Container} className="min-h-screen">
                  {/* Default content if empty */}
                  {!currentPage && (
                    <div className="flex items-center justify-center min-h-[400px] text-gray-400">
                      <div className="text-center">
                        <p className="text-lg font-medium mb-2">No page selected</p>
                        <p className="text-sm">Create a new page to start building</p>
                      </div>
                    </div>
                  )}
                </Element>
              </Frame>
            </Editor>
          </div>
        </div>
      </div>
    </div>
  );
}


