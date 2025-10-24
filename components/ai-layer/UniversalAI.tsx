'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
}

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// AI Context that's available everywhere
const AIContext = createContext<AIAssistant | null>(null);

export function AIProvider({ children }: { children: ReactNode }) {
  const [assistant] = useState(() => new AIAssistant());

  return (
    <AIContext.Provider value={assistant}>
      {children}
      <FloatingAI />
      <AICommandPalette />
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (!context) throw new Error('useAI must be used within AIProvider');
  return context;
}

// Floating AI Assistant (always visible)
function FloatingAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: AIMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages
        })
      });

      const data = await response.json();

      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.1}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br 
                   from-indigo-500 to-purple-600 rounded-full shadow-2xl
                   flex items-center justify-center z-50 cursor-move"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="text-2xl"
        >
          ✨
        </motion.div>
      </motion.button>

      {/* AI Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-28 right-8 w-96 h-[600px] 
                       bg-white/10 backdrop-blur-2xl rounded-3xl
                       border border-white/20 shadow-2xl z-50
                       flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-indigo-500/20 to-purple-500/20">
              <h3 className="text-white font-semibold text-lg">AI Assistant</h3>
              <p className="text-white/60 text-sm">Ask me anything about JCAL.ai</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-6xl mb-4">🤖</div>
                  <h4 className="text-white font-semibold mb-2">How can I help?</h4>
                  <p className="text-white/60 text-sm">
                    Try asking about creating agents, projects, or anything else!
                  </p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <MessageBubble key={i} message={msg} />
                ))
              )}
              {isLoading && (
                <div className="flex items-center gap-2 text-white/60">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ⚡
                  </motion.div>
                  <span>Thinking...</span>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10
                           rounded-xl text-white placeholder-white/40
                           focus:outline-none focus:border-white/30"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={isLoading}
                  className="px-4 py-3 bg-white text-indigo-900 rounded-xl
                           font-semibold hover:shadow-lg transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MessageBubble({ message }: { message: AIMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          message.role === 'user'
            ? 'bg-white text-indigo-900'
            : 'bg-white/10 text-white'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p className="text-xs opacity-60 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );
}

// Command Palette (Cmd+K)
function AICommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const quickActions = [
    {
      icon: '🤖',
      label: 'Create new agent',
      shortcut: 'Ctrl+A',
      action: () => window.location.href = '/agents/new'
    },
    {
      icon: '🚀',
      label: 'Create new project',
      shortcut: 'Ctrl+N',
      action: () => window.location.href = '/builder/new'
    },
    {
      icon: '📊',
      label: 'View analytics',
      shortcut: 'Ctrl+D',
      action: () => window.location.href = '/dashboard'
    },
    {
      icon: '🔍',
      label: 'Search everything',
      shortcut: 'Ctrl+F',
      action: () => {}
    },
    {
      icon: '⚙️',
      label: 'Settings',
      shortcut: 'Ctrl+,',
      action: () => window.location.href = '/settings'
    }
  ];

  const filteredActions = quickActions.filter(action =>
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]
                     flex items-start justify-center pt-32"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white/10 backdrop-blur-2xl
                       rounded-3xl border border-white/20 shadow-2xl
                       overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <span className="text-2xl">🔍</span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask AI anything... or use / for commands"
                  autoFocus
                  className="flex-1 text-2xl bg-transparent text-white
                           placeholder-white/40 focus:outline-none"
                />
                <kbd className="px-2 py-1 bg-white/10 rounded text-sm text-white/60">
                  Esc
                </kbd>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {filteredActions.length > 0 ? (
                <div className="space-y-2">
                  {filteredActions.map((action, i) => (
                    <QuickAction
                      key={i}
                      {...action}
                      onClick={() => {
                        action.action();
                        setIsOpen(false);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-white/60">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function QuickAction({ 
  icon, 
  label, 
  shortcut, 
  onClick 
}: { 
  icon: string; 
  label: string; 
  shortcut: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.1)' }}
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 rounded-xl
                 text-left text-white/80 hover:text-white transition-colors"
    >
      <div className="flex items-center gap-4">
        <span className="text-2xl">{icon}</span>
        <span>{label}</span>
      </div>
      <kbd className="px-2 py-1 bg-white/10 rounded text-sm text-white/60">
        {shortcut}
      </kbd>
    </motion.button>
  );
}

// AI Assistant Class
class AIAssistant {
  async query(prompt: string, context?: any): Promise<string> {
    const response = await fetch('/api/ai/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context })
    });
    
    const data = await response.json();
    return data.response;
  }
  
  async analyzeContext(): Promise<any> {
    // Analyzes current page/context
    return {
      page: window.location.pathname,
      timestamp: new Date()
    };
  }
  
  async suggest(): Promise<Suggestion[]> {
    // Proactive suggestions
    return [];
  }
}

