'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  X, 
  Code, 
  Palette, 
  Layout, 
  Type,
  Sparkles,
  Copy,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SelectedElement {
  id: string;
  tagName: string;
  className: string;
  textContent?: string;
  styles: Record<string, string>;
  attributes: Record<string, string>;
  xpath: string;
}

export function ComponentInspector({ projectId }: { projectId: string }) {
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Listen for element selection from preview iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'element-selected') {
        setSelectedElement(event.data.element);
        setIsOpen(true);
      }
      if (event.data.type === 'inspector-toggled') {
        // Handle inspector toggle
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const updateStyle = async (property: string, value: string) => {
    if (!selectedElement) return;

    // Send update to preview iframe
    const previewIframe = document.querySelector('iframe');
    if (previewIframe?.contentWindow) {
      previewIframe.contentWindow.postMessage({
        type: 'update-element-style',
        data: {
          xpath: selectedElement.xpath,
          property,
          value
        }
      }, '*');
    }

    // Update local state
    setSelectedElement(prev => prev ? {
      ...prev,
      styles: { ...prev.styles, [property]: value }
    } : null);

    // TODO: Save to database/file system
  };

  const aiEnhance = async (type: 'prettier' | 'responsive' | 'animation') => {
    // TODO: Implement AI enhancement
    console.log('AI enhance:', type);
  };

  if (!isOpen || !selectedElement) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 bottom-0 w-[420px] 
                   bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800
                   shadow-2xl z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Inspector</h3>
                <p className="text-xs text-gray-500">Alt+Click to select</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs">
              {selectedElement.tagName}
            </code>
            {selectedElement.className && (
              <code className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded font-mono text-xs">
                .{selectedElement.className.split(' ')[0]}
              </code>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="styles" className="p-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="styles" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Styles
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Content
            </TabsTrigger>
          </TabsList>

          {/* Styles Tab */}
          <TabsContent value="styles" className="space-y-6 mt-0">
            <StyleSection title="Typography">
              <StyleInput
                label="Font Size"
                value={selectedElement.styles.fontSize || '16px'}
                onChange={(value) => updateStyle('fontSize', value)}
                type="text"
              />
              <StyleInput
                label="Font Weight"
                value={selectedElement.styles.fontWeight || 'normal'}
                onChange={(value) => updateStyle('fontWeight', value)}
                type="select"
                options={['normal', '500', '600', '700', 'bold']}
              />
              <StyleInput
                label="Color"
                value={selectedElement.styles.color || '#000000'}
                onChange={(value) => updateStyle('color', value)}
                type="color"
              />
            </StyleSection>

            <StyleSection title="Spacing">
              <StyleInput
                label="Margin"
                value={selectedElement.styles.margin || '0'}
                onChange={(value) => updateStyle('margin', value)}
                type="text"
              />
              <StyleInput
                label="Padding"
                value={selectedElement.styles.padding || '0'}
                onChange={(value) => updateStyle('padding', value)}
                type="text"
              />
            </StyleSection>

            <StyleSection title="Background">
              <StyleInput
                label="Background Color"
                value={selectedElement.styles.backgroundColor || 'transparent'}
                onChange={(value) => updateStyle('backgroundColor', value)}
                type="color"
              />
            </StyleSection>

            <StyleSection title="Borders">
              <StyleInput
                label="Border"
                value={selectedElement.styles.border || 'none'}
                onChange={(value) => updateStyle('border', value)}
                type="text"
              />
              <StyleInput
                label="Border Radius"
                value={selectedElement.styles.borderRadius || '0'}
                onChange={(value) => updateStyle('borderRadius', value)}
                type="text"
              />
            </StyleSection>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="space-y-6 mt-0">
            <StyleSection title="Display">
              <StyleInput
                label="Display"
                value={selectedElement.styles.display || 'block'}
                onChange={(value) => updateStyle('display', value)}
                type="select"
                options={['block', 'inline-block', 'flex', 'grid', 'none']}
              />
            </StyleSection>

            <StyleSection title="Position">
              <StyleInput
                label="Position"
                value={selectedElement.styles.position || 'static'}
                onChange={(value) => updateStyle('position', value)}
                type="select"
                options={['static', 'relative', 'absolute', 'fixed', 'sticky']}
              />
            </StyleSection>

            <StyleSection title="Flexbox">
              <StyleInput
                label="Flex Direction"
                value={selectedElement.styles.flexDirection || 'row'}
                onChange={(value) => updateStyle('flexDirection', value)}
                type="select"
                options={['row', 'row-reverse', 'column', 'column-reverse']}
              />
              <StyleInput
                label="Justify Content"
                value={selectedElement.styles.justifyContent || 'flex-start'}
                onChange={(value) => updateStyle('justifyContent', value)}
                type="select"
                options={['flex-start', 'center', 'flex-end', 'space-between', 'space-around']}
              />
              <StyleInput
                label="Align Items"
                value={selectedElement.styles.alignItems || 'stretch'}
                onChange={(value) => updateStyle('alignItems', value)}
                type="select"
                options={['stretch', 'flex-start', 'center', 'flex-end']}
              />
            </StyleSection>

            <StyleSection title="Size">
              <StyleInput
                label="Width"
                value={selectedElement.styles.width || 'auto'}
                onChange={(value) => updateStyle('width', value)}
                type="text"
              />
              <StyleInput
                label="Height"
                value={selectedElement.styles.height || 'auto'}
                onChange={(value) => updateStyle('height', value)}
                type="text"
              />
            </StyleSection>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6 mt-0">
            <StyleSection title="Text Content">
              <textarea
                value={selectedElement.textContent || ''}
                onChange={(e) => {
                  const previewIframe = document.querySelector('iframe');
                  if (previewIframe?.contentWindow) {
                    previewIframe.contentWindow.postMessage({
                      type: 'update-element-content',
                      data: {
                        xpath: selectedElement.xpath,
                        content: e.target.value
                      }
                    }, '*');
                  }
                }}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           min-h-[100px]"
                placeholder="Element text content..."
              />
            </StyleSection>
          </TabsContent>
        </Tabs>

        {/* AI Quick Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">AI Quick Actions</p>
          </div>
          <div className="space-y-2">
            <Button
              onClick={() => aiEnhance('prettier')}
              variant="outline"
              className="w-full justify-start"
            >
              🎨 Make it prettier
            </Button>
            <Button
              onClick={() => aiEnhance('responsive')}
              variant="outline"
              className="w-full justify-start"
            >
              📱 Make responsive
            </Button>
            <Button
              onClick={() => aiEnhance('animation')}
              variant="outline"
              className="w-full justify-start"
            >
              ⚡ Add animation
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function StyleSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function StyleInput({ 
  label, 
  value, 
  onChange, 
  type = 'text',
  options = []
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  type?: 'text' | 'select' | 'color';
  options?: string[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
        {label}
      </label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : type === 'color' ? (
        <div className="flex gap-2">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-10 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      )}
    </div>
  );
}
