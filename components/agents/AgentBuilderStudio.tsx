'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Agent, AgentFactory } from '@/lib/agent-system/agent-core';

export function AgentBuilderStudio() {
  const [step, setStep] = useState(1);
  const [agent, setAgent] = useState<Partial<Agent>>({
    capabilities: [],
    tools: [],
    model: 'gemini',
    temperature: 0.7
  });

  const createAgentHandler = async () => {
    try {
      const newAgent = AgentFactory.createAgent(agent);
      
      // Save to database via API
      const response = await fetch('/api/agents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAgent)
      });
      
      if (response.ok) {
        // Redirect to agent dashboard
        window.location.href = '/agents';
      }
    } catch (error) {
      console.error('Failed to create agent:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-indigo-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-white mb-4">
            Create Your Agent
          </h1>
          <p className="text-xl text-white/80">
            Build an autonomous AI agent for any task
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4].map((s) => (
              <motion.div
                key={s}
                className={`flex items-center ${s < 4 ? 'gap-4' : ''}`}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center
                    font-semibold transition-all cursor-pointer ${
                      step >= s
                        ? 'bg-white text-indigo-900'
                        : 'bg-white/20 text-white/60'
                    }`}
                  onClick={() => setStep(s)}
                >
                  {s}
                </motion.div>
                {s < 4 && (
                  <div
                    className={`w-16 h-1 rounded transition-all ${
                      step > s ? 'bg-white' : 'bg-white/20'
                    }`}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Builder Card */}
        <motion.div
          layout
          className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl 
                     rounded-3xl border border-white/20 shadow-2xl p-8"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <StepIdentity agent={agent} setAgent={setAgent} />
              </motion.div>
            )}
            
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <StepCapabilities agent={agent} setAgent={setAgent} />
              </motion.div>
            )}
            
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <StepConfiguration agent={agent} setAgent={setAgent} />
              </motion.div>
            )}
            
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <StepReview agent={agent} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-white/10 text-white rounded-xl
                         hover:bg-white/20 transition-colors"
              >
                Back
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => step < 4 ? setStep(step + 1) : createAgentHandler()}
              className="ml-auto px-8 py-3 bg-white text-indigo-900 rounded-xl
                       font-semibold hover:shadow-lg transition-all"
            >
              {step < 4 ? 'Continue' : 'Create Agent'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StepIdentity({ agent, setAgent }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Agent Identity</h2>
      
      {/* Avatar Selection */}
      <div>
        <label className="block text-white/80 mb-3">Choose an Avatar</label>
        <div className="grid grid-cols-6 gap-3">
          {['🤖', '🧠', '⚡', '🎯', '🚀', '💎', '🔮', '🎨', '🔧', '📊', '🌟', '💡'].map((emoji) => (
            <motion.button
              key={emoji}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setAgent({ ...agent, avatar: emoji })}
              className={`w-16 h-16 text-4xl rounded-2xl transition-all ${
                agent.avatar === emoji
                  ? 'bg-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-white/80 mb-2">Agent Name</label>
        <input
          type="text"
          value={agent.name || ''}
          onChange={(e) => setAgent({ ...agent, name: e.target.value })}
          placeholder="e.g., Research Assistant, Code Reviewer, Content Creator"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 
                   rounded-xl text-white placeholder-white/40
                   focus:outline-none focus:border-white/40"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-white/80 mb-2">What does this agent do?</label>
        <textarea
          value={agent.description || ''}
          onChange={(e) => setAgent({ ...agent, description: e.target.value })}
          placeholder="Describe your agent's purpose and responsibilities..."
          className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 
                   rounded-xl text-white placeholder-white/40 resize-none
                   focus:outline-none focus:border-white/40"
        />
      </div>

      {/* AI Model Selection */}
      <div>
        <label className="block text-white/80 mb-3">AI Model</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'claude', name: 'Claude', desc: 'Best for reasoning', icon: '🧠' },
            { id: 'gpt', name: 'GPT-4o', desc: 'Best for speed', icon: '⚡' },
            { id: 'gemini', name: 'Gemini', desc: 'Best for cost', icon: '💎' }
          ].map((model) => (
            <motion.button
              key={model.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAgent({ ...agent, model: model.id })}
              className={`p-4 rounded-xl text-left transition-all ${
                agent.model === model.id
                  ? 'bg-white text-indigo-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <div className="text-3xl mb-2">{model.icon}</div>
              <div className="font-semibold">{model.name}</div>
              <div className="text-sm opacity-80">{model.desc}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepCapabilities({ agent, setAgent }: any) {
  const availableCapabilities = [
    { name: 'web_browsing', label: 'Web Browsing', desc: 'Can search and browse the internet', icon: '🌐' },
    { name: 'code_execution', label: 'Code Execution', desc: 'Can write and run code', icon: '💻' },
    { name: 'file_operations', label: 'File Operations', desc: 'Can read/write files', icon: '📁' },
    { name: 'api_calls', label: 'API Integration', desc: 'Can call external APIs', icon: '🔌' },
    { name: 'data_analysis', label: 'Data Analysis', desc: 'Can analyze datasets', icon: '📊' },
    { name: 'image_generation', label: 'Image Generation', desc: 'Can create images', icon: '🎨' },
    { name: 'long_term_memory', label: 'Long-term Memory', desc: 'Remembers past conversations', icon: '🧠' },
    { name: 'multi_agent', label: 'Multi-Agent Collaboration', desc: 'Can work with other agents', icon: '👥' }
  ];

  const toggleCapability = (cap: any) => {
    const capabilities = agent.capabilities || [];
    const exists = capabilities.find((c: any) => c.name === cap.name);
    
    if (exists) {
      setAgent({
        ...agent,
        capabilities: capabilities.filter((c: any) => c.name !== cap.name)
      });
    } else {
      setAgent({
        ...agent,
        capabilities: [...capabilities, { ...cap, enabled: true }]
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Agent Capabilities</h2>
      <p className="text-white/80 mb-6">Select what your agent can do</p>

      <div className="grid grid-cols-2 gap-4">
        {availableCapabilities.map((cap) => {
          const isSelected = agent.capabilities?.some((c: any) => c.name === cap.name);
          
          return (
            <motion.button
              key={cap.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleCapability(cap)}
              className={`p-4 rounded-xl text-left transition-all ${
                isSelected
                  ? 'bg-white text-indigo-900 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{cap.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold mb-1">{cap.label}</div>
                  <div className="text-sm opacity-80">{cap.desc}</div>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs"
                  >
                    ✓
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function StepConfiguration({ agent, setAgent }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Agent Configuration</h2>

      {/* System Prompt */}
      <div>
        <label className="block text-white/80 mb-2">System Prompt (Optional)</label>
        <textarea
          value={agent.systemPrompt || ''}
          onChange={(e) => setAgent({ ...agent, systemPrompt: e.target.value })}
          placeholder="Custom instructions for your agent..."
          className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 
                   rounded-xl text-white placeholder-white/40 resize-none
                   focus:outline-none focus:border-white/40"
        />
      </div>

      {/* Temperature */}
      <div>
        <label className="block text-white/80 mb-2">
          Creativity Level: {agent.temperature || 0.7}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={agent.temperature || 0.7}
          onChange={(e) => setAgent({ ...agent, temperature: parseFloat(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-white/60 mt-2">
          <span>Precise</span>
          <span>Balanced</span>
          <span>Creative</span>
        </div>
      </div>
    </div>
  );
}

function StepReview({ agent }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Review Your Agent</h2>
      
      <div className="bg-white/5 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-6xl">{agent.avatar || '🤖'}</span>
          <div>
            <h3 className="text-2xl font-bold text-white">{agent.name || 'Unnamed Agent'}</h3>
            <p className="text-white/60">{agent.description || 'No description'}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="text-white/60 text-sm mb-2">AI Model:</p>
          <p className="text-white font-semibold capitalize">{agent.model || 'gemini'}</p>
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="text-white/60 text-sm mb-2">Capabilities:</p>
          <div className="flex flex-wrap gap-2">
            {agent.capabilities?.map((cap: any) => (
              <span
                key={cap.name}
                className="px-3 py-1 bg-white/10 text-white rounded-full text-sm"
              >
                {cap.icon} {cap.label}
              </span>
            )) || <span className="text-white/60">No capabilities selected</span>}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="text-white/60 text-sm mb-2">Creativity Level:</p>
          <p className="text-white font-semibold">{agent.temperature || 0.7}</p>
        </div>
      </div>
    </div>
  );
}

