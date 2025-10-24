'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Bot, User, Sparkles, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { MessageBubble } from './messages/MessageBubble';
import { TypingIndicator } from './messages/TypingIndicator';

interface ChatTabProps {
  projectId: string;
  onBuildTriggered?: () => void;
}

type AIMode = 'agent' | 'chat';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system' | 'error';
  content: string;
  timestamp: Date;
  actions?: any[];
}

export function ChatTab({ projectId, onBuildTriggered }: ChatTabProps) {
  const [mode, setMode] = useState<AIMode>('agent');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  useEffect(() => {
    setMessages([{
      id: '1',
      type: 'ai',
      content: `Hi! I'm your AI Builder Assistant powered by Multi-AI (Claude, GPT, Gemini).

**Current Mode: Agent** (I'll build things for you)

Try commands like:
- "Add a login page with email and password fields"
- "Create a user dashboard with a sidebar"
- "Add a dark mode toggle to the header"

Switch to **Chat mode** above if you just want to ask questions!`,
      timestamp: new Date()
    }]);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update welcome message when mode changes
  useEffect(() => {
    const welcomeIndex = messages.findIndex(m => m.id === '1');
    if (welcomeIndex !== -1) {
      const updatedMessages = [...messages];
      updatedMessages[welcomeIndex] = {
        ...updatedMessages[welcomeIndex],
        content: mode === 'agent' 
          ? `Hi! I'm your AI Builder Assistant powered by Multi-AI.

**Current Mode: Agent** (I'll build things for you)

Try commands like:
- "Add a login page with email and password fields"
- "Create a user dashboard with a sidebar"
- "Add a dark mode toggle to the header"`
          : `Hi! I'm your AI Builder Assistant.

**Current Mode: Chat** (Just conversation)

Ask me anything about:
- Best practices for your app
- Technical questions
- Design suggestions
- Framework recommendations

Switch to **Agent mode** to have me build things for you!`
      };
      setMessages(updatedMessages);
    }
  }, [mode]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      if (mode === 'agent') {
        // AGENT MODE: Actually build/execute
        const response = await fetch('/api/ai/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            message: currentInput,
            conversationHistory: messages.slice(-5).map(m => ({
              role: m.type === 'user' ? 'user' : 'assistant',
              content: m.content
            }))
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.details || data.error || 'Failed to process request');
        }

        // AI response in plain English
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: data.response,
          timestamp: new Date(),
          actions: data.actions
        };

        setMessages(prev => [...prev, aiMessage]);

        // Execute actions if any
        if (data.actions && data.actions.length > 0) {
          const executionMessage: Message = {
            id: Date.now().toString(),
            type: 'system',
            content: `🔨 Building ${data.actions.length} change${data.actions.length > 1 ? 's' : ''}...`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, executionMessage]);

          // Execute each action
          let successCount = 0;
          for (const action of data.actions) {
            try {
              await executeAction(projectId, action);
              successCount++;
            } catch (err) {
              console.error('Action execution error:', err);
            }
          }

          // Remove "Building..." message and add completion message
          setMessages(prev => {
            const withoutBuilding = prev.filter(m => m.id !== executionMessage.id);
            return [
              ...withoutBuilding,
              {
                id: Date.now().toString(),
                type: 'system',
                content: `✅ Done! ${successCount} of ${data.actions.length} changes applied successfully. Your changes are now visible in the preview.`,
                timestamp: new Date()
              }
            ];
          });

          // Trigger rebuild callback
          onBuildTriggered?.();

          // Notify user
          toast.success('Build complete!');
        }

      } else {
        // CHAT MODE: Just conversation, no execution
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: currentInput,
            conversationHistory: messages.slice(-10).map(m => ({
              role: m.type === 'user' ? 'user' : 'assistant',
              content: m.content
            }))
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.details || data.error || 'Failed to process request');
        }

        const aiMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: data.response,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
      }

    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'error',
        content: error.message || 'Sorry, something went wrong. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to process message');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header with Mode Toggle */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Builder Assistant</h3>
            <p className="text-sm text-gray-500">Powered by Multi-AI (Claude/GPT/Gemini)</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium">Online</span>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setMode('agent')}
            className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
              mode === 'agent'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Bot className="w-4 h-4" />
              <span>Agent Mode</span>
            </div>
            <div className="text-xs font-normal text-gray-500 mt-0.5">
              Builds for you
            </div>
          </button>
          <button
            onClick={() => setMode('chat')}
            className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
              mode === 'chat'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>Chat Mode</span>
            </div>
            <div className="text-xs font-normal text-gray-500 mt-0.5">
              Just talk
            </div>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white flex-shrink-0">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'agent' 
              ? "Describe what you want to build... (Shift+Enter for new line)" 
              : "Ask me anything... (Shift+Enter for new line)"}
            rows={2}
            data-chat-input
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg resize-none
                     focus:ring-2 focus:ring-purple-500 focus:border-transparent
                     transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300
                     text-white rounded-lg font-medium transition-all flex items-center gap-2
                     disabled:cursor-not-allowed"
          >
            {isTyping ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="hidden sm:inline">Processing</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send</span>
              </>
            )}
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {mode === 'agent' 
            ? "Be specific about what you want to build for best results"
            : "I'm here to answer your questions and help brainstorm ideas"}
        </div>
      </div>
    </div>
  );
}

// Helper function to execute actions
async function executeAction(projectId: string, action: any) {
  switch (action.type) {
    case 'create_page':
      await fetch('/api/pages/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          name: action.data.name,
          path: action.data.route,
          template: action.data.template || 'blank'
        })
      });
      break;
    
    case 'add_component':
      await fetch('/api/components/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          component: {
            name: action.data.name,
            category: action.data.category,
            code: action.data.code
          }
        })
      });
      break;
    
    case 'modify_code':
      // Placeholder for code modification
      console.log('Modify code action:', action.data);
      break;
    
    default:
      console.log('Unknown action type:', action.type);
  }
}
