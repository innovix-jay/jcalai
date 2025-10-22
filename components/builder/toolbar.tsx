'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Code,
  Eye,
  Database,
  Sparkles,
  Save,
  Play,
  Settings,
  Download,
  Users,
  ChevronDown,
} from 'lucide-react';

interface BuilderToolbarProps {
  project: any;
  currentPage: any;
  viewMode: 'preview' | 'backend';
  setViewMode: (mode: 'preview' | 'backend') => void;
  selectedModel: 'auto' | 'claude' | 'openai' | 'gemini';
  setSelectedModel: (model: 'auto' | 'claude' | 'openai' | 'gemini') => void;
  showAIPanel: boolean;
  setShowAIPanel: (show: boolean) => void;
}

export function BuilderToolbar({
  project,
  currentPage,
  viewMode,
  setViewMode,
  selectedModel,
  setSelectedModel,
  showAIPanel,
  setShowAIPanel,
}: BuilderToolbarProps) {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/projects" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-800">JCAL.ai</span>
        </Link>

        <div className="h-6 w-px bg-gray-300" />

        <div>
          <h1 className="text-sm font-semibold text-gray-800">{project?.name}</h1>
          <p className="text-xs text-gray-500">{currentPage?.name || 'No page selected'}</p>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center space-x-2">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setViewMode('preview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'preview'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Eye className="w-4 h-4 inline-block mr-2" />
            Preview
          </button>
          <button
            onClick={() => setViewMode('backend')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'backend'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Database className="w-4 h-4 inline-block mr-2" />
            Backend
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        {/* AI Model Selector */}
        <div className="relative group">
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span className="capitalize">{selectedModel === 'auto' ? 'Auto (Smart)' : selectedModel}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 px-2 py-1 mb-1">AI Model</div>
              <button
                onClick={() => setSelectedModel('auto')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 ${
                  selectedModel === 'auto' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                <Sparkles className="w-4 h-4 inline-block mr-2" />
                Auto (Recommended)
                <p className="text-xs text-gray-500 mt-1">Automatically selects the best model</p>
              </button>
              <button
                onClick={() => setSelectedModel('claude')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 ${
                  selectedModel === 'claude' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                Claude Sonnet 3.5
                <p className="text-xs text-gray-500">Best for code & architecture</p>
              </button>
              <button
                onClick={() => setSelectedModel('openai')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 ${
                  selectedModel === 'openai' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                GPT-4 Turbo
                <p className="text-xs text-gray-500">Best for creative & general tasks</p>
              </button>
              <button
                onClick={() => setSelectedModel('gemini')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 ${
                  selectedModel === 'gemini' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                Gemini 1.5 Pro
                <p className="text-xs text-gray-500">Best for large context & cost</p>
              </button>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setShowAIPanel(!showAIPanel)}
          variant={showAIPanel ? 'default' : 'outline'}
          size="sm"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          AI Assistant
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Users className="w-4 h-4 mr-2" />
          Share
        </Button>
        
        <Button variant="outline" size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>

        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>

        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          <Play className="w-4 h-4 mr-2" />
          Deploy
        </Button>

        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}


