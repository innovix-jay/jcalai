'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { MessageBubble } from './messages/MessageBubble';
import { TypingIndicator } from './messages/TypingIndicator';
import { SuggestedActions } from './messages/SuggestedActions';
import { aiOnboardingService } from '@/services/ai-onboarding-service';
import type { AIProvider } from '@/lib/ai/model-router';
import type { ConversationContext, ConversationMessage } from '@/types/onboarding';
import toast from 'react-hot-toast';
import { Cpu } from 'lucide-react';

interface AIAssistantPanelProps {
  projectId: string;
  projectName: string;
  initialPrompt: string;
  isNew?: boolean;
  selectedModel?: AIProvider;
  onClose?: () => void;
  onPlanReady?: (plan: any) => void;
  onBuildStart?: () => void;
}

export function AIAssistantPanel({
  projectId,
  projectName,
  initialPrompt,
  isNew = false,
  selectedModel = 'auto',
  onClose,
  onPlanReady,
  onBuildStart,
}: AIAssistantPanelProps) {
  const [context, setContext] = useState<ConversationContext | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentModel, setCurrentModel] = useState<AIProvider>(selectedModel);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [context?.messages, isTyping]);

  // Initialize conversation
  useEffect(() => {
    async function init() {
      try {
        // Try to load existing context
        let existingContext = await aiOnboardingService.loadContext(projectId);

        if (!existingContext && isNew) {
          // Initialize new conversation for new projects
          existingContext = await aiOnboardingService.initiateProject(
            projectId,
            projectName,
            initialPrompt,
            currentModel
          );
        }

        if (existingContext) {
          setContext(existingContext);
        }
      } catch (error) {
        console.error('Failed to initialize AI assistant:', error);
        toast.error('Failed to start AI conversation');
      }
    }

    init();
  }, [projectId, projectName, initialPrompt, isNew, currentModel]);

  // Handle sending message
  const handleSend = async () => {
    if (!userInput.trim() || !context || isProcessing) return;

    const message = userInput.trim();
    setUserInput('');
    setIsProcessing(true);
    setIsTyping(true);

    try {
      const response = await aiOnboardingService.continueConversation(message, context, currentModel);

      setIsTyping(false);

      // Update context with new messages
      const updatedContext = await aiOnboardingService.loadContext(projectId);
      if (updatedContext) {
        setContext(updatedContext);

        // Check if plan is ready
        if (response.planReady && response.plan) {
          onPlanReady?.(response.plan);
        } else if (response.stage === 'CONFIRMING_PLAN' && !response.plan && context.requirements) {
          // Generate plan if we're at confirmation stage
          const plan = await aiOnboardingService.generatePlan(context);
          if (plan) {
            onPlanReady?.(plan);
          }
        }

        // Check if building started
        if (response.stage === 'BUILDING') {
          onBuildStart?.();
        }
      }
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error(error.message || 'Failed to process message. Check your API keys.');
      setIsTyping(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle suggested action click
  const handleSuggestedAction = (action: string) => {
    setUserInput(action);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [userInput]);

  return (
    <motion.div
      initial={{ x: 480, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 480, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-[480px] 
                 bg-white/80 dark:bg-gray-900/80 
                 backdrop-blur-xl border-l border-gray-200/50
                 shadow-2xl shadow-indigo-500/10
                 flex flex-col z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {context?.stage === 'GREETING' && 'Ready to help you build'}
              {context?.stage === 'GATHERING_REQUIREMENTS' && 'Gathering requirements...'}
              {context?.stage === 'CONFIRMING_PLAN' && 'Planning your project'}
              {context?.stage === 'BUILDING' && 'Building your app...'}
              {context?.stage === 'COMPLETED' && 'Project complete!'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Model Selector */}
          <div className="relative">
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5" />
              {currentModel === 'auto' ? 'Auto' : currentModel === 'claude' ? 'Claude 4.5' : currentModel === 'openai' ? 'GPT-5' : 'Gemini 2.0'}
            </button>
            
            {showModelSelector && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50"
              >
                {(['auto', 'claude', 'openai', 'gemini'] as AIProvider[]).map((model) => (
                  <button
                    key={model}
                    onClick={() => {
                      setCurrentModel(model);
                      aiOnboardingService.setModel(model);
                      setShowModelSelector(false);
                      toast.success(`Switched to ${model === 'auto' ? 'Auto Select' : model}`);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      currentModel === model ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : ''
                    }`}
                  >
                    {model === 'auto' && '🤖 Auto Select'}
                    {model === 'claude' && '🧠 Claude 4.5 Sonnet'}
                    {model === 'openai' && '💬 GPT-5'}
                    {model === 'gemini' && '⚡ Gemini 2.0 Flash'}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {context?.messages.map((message, index) => (
          <div key={message.id}>
            <MessageBubble
              message={message}
              isLatest={index === context.messages.length - 1}
            />
            
            {/* Show suggested actions for AI messages */}
            {message.role === 'ai' &&
              message.metadata?.suggestedActions &&
              index === context.messages.length - 1 &&
              !isProcessing && (
                <SuggestedActions
                  actions={message.metadata.suggestedActions}
                  onActionClick={handleSuggestedAction}
                />
              )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200/50 p-4 bg-white/50 dark:bg-gray-900/50">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Enter to send)"
            disabled={isProcessing}
            className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 
                     border border-gray-300 dark:border-gray-700 
                     rounded-xl resize-none max-h-32 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all"
            rows={1}
          />
          <motion.button
            onClick={handleSend}
            disabled={!userInput.trim() || isProcessing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600
                     text-white rounded-xl font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:shadow-lg transition-all
                     flex items-center gap-2"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Powered by AI • Press Enter to send
        </p>
      </div>
    </motion.div>
  );
}

