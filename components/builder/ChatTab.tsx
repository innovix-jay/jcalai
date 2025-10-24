'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Send, Loader2, Bot, MessageSquare, Mic, MicOff } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ChatTabProps {
  projectId: string;
  onBuildTriggered?: () => void;
}

type AIMode = 'agent' | 'chat';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  mode: AIMode;
  actions?: any[];
  created_at: string;
}

export function ChatTab({ projectId, onBuildTriggered }: ChatTabProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<AIMode>('agent');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load chat history from Supabase on mount
  useEffect(() => {
    loadChatHistory();
  }, [projectId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;

      if (data && data.length > 0) {
        setMessages(data);
      } else {
        // Add welcome message if no history
        const welcomeMessage: Message = {
          id: 'welcome',
          role: 'assistant',
          content: `Hi! I'm your AI Builder Assistant powered by Multi-AI (Claude, GPT, Gemini).

**Current Mode: Agent** (I'll build things for you)

Try commands like:
- "Add a login page with email and password fields"
- "Create a user dashboard with a sidebar"
- "Add a dark mode toggle to the header"

Switch to **Chat mode** above if you just want to ask questions!`,
          mode: 'agent',
          created_at: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      toast.error('Failed to load chat history');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: input,
      mode: mode,
      created_at: new Date().toISOString()
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
          mode: mode,
          projectId: projectId,
          conversationHistory: messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to get response');
      }

      const data = await response.json();

      // Reload messages from database to get saved versions
      await loadChatHistory();

      // Execute actions if in agent mode
      if (mode === 'agent' && data.actions?.length > 0) {
        toast.loading('Executing actions...');
        
        const { executeActions } = await import('@/lib/ai/actionExecutor');
        const results = await executeActions(projectId, data.actions);
        
        const successCount = results.filter(r => r.success).length;
        if (successCount > 0) {
          toast.success(`Successfully executed ${successCount} action(s)!`);
          onBuildTriggered?.();
        }
      }

    } catch (error: any) {
      console.error('Chat error:', error);
      toast.error(error.message || 'Failed to send message');
      
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'error',
        content: `Error: ${error.message}`,
        mode: mode,
        created_at: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Voice input handlers
  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice recognition is not supported in your browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast('Listening... Speak now', { icon: '🎤', duration: 2000 });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      toast.success('Voice input captured!');
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'no-speech') {
        toast.error('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        toast.error('Microphone access denied. Please enable it in your browser settings.');
      } else {
        toast.error('Voice input failed. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Builder Assistant</h3>
            <p className="text-sm text-gray-500">Multi-AI (Claude/GPT/Gemini)</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Online
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setMode('agent')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              mode === 'agent'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Bot className="w-4 h-4" />
              <span>Agent Mode</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">Builds for you</div>
          </button>
          <button
            onClick={() => setMode('chat')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              mode === 'chat'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>Chat Mode</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">Just talk</div>
          </button>
        </div>
      </div>

      {/* Messages - SCROLLABLE */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p className="mb-4">No messages yet. Start a conversation!</p>
            {mode === 'agent' && (
              <div className="text-sm">
                <p className="mb-2">Try commands like:</p>
                <div className="space-y-1">
                  <p>"Add a login page with email and password"</p>
                  <p>"Create a user dashboard"</p>
                  <p>"Add a navigation header"</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {messages.map((msg, index) => (
          <MessageBubble key={msg.id || index} message={msg} />
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">✨</span>
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input - CRITICAL: Explicit colors for visibility */}
      <div className="px-6 py-4 border-t bg-white flex-shrink-0">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'agent' ? "Describe what you want to build..." : "Ask me anything..."}
            rows={2}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg resize-none 
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{ 
              color: '#111827',           // CRITICAL: Explicit dark text color
              backgroundColor: '#ffffff'  // CRITICAL: Explicit white background
            }}
          />
          <button
            onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
            disabled={isLoading}
            className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 disabled:cursor-not-allowed ${
              isListening ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title={isListening ? 'Stop listening' : 'Voice input'}
          >
            {isListening ? (<MicOff className="w-5 h-5" />) : (<Mic className="w-5 h-5" />)}
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                       disabled:bg-gray-300 disabled:cursor-not-allowed transition-all 
                       flex items-center gap-2 h-[52px]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="font-medium">Send</span>
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {mode === 'agent' 
            ? "Be specific about what you want to build for best results" 
            : "I'm here to answer questions and help brainstorm ideas"}
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-purple-600 text-white rounded-lg px-4 py-3">
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
          <div className="text-xs text-purple-200 mt-1">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  }

  if (message.role === 'assistant') {
    // Remove JSON code blocks from display
    const displayContent = message.content.replace(/```json\n[\s\S]*?\n```/g, '');
    
    return (
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm">✨</span>
        </div>
        <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3">
          <div className="prose prose-sm max-w-none text-gray-900">
            <ReactMarkdown>{displayContent}</ReactMarkdown>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  }

  if (message.role === 'system') {
    return (
      <div className="flex justify-center">
        <div className="bg-blue-50 text-blue-700 rounded-lg px-4 py-2 text-sm">
          {message.content}
        </div>
      </div>
    );
  }

  if (message.role === 'error') {
    return (
      <div className="flex justify-center">
        <div className="bg-red-50 text-red-700 rounded-lg px-4 py-2 text-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return null;
}
