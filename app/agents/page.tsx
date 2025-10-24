'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { fadeIn, staggerContainer } from '@/lib/design-system/motion';

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const response = await fetch('/api/agents/list');
      const data = await response.json();
      setAgents(data.agents || []);
    } catch (error) {
      console.error('Failed to load agents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Your AI Agents
          </h1>
          <p className="text-xl text-white/80">
            Autonomous assistants that work for you 24/7
          </p>
        </motion.div>

        {/* Create Agent Button */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-8"
        >
          <Link href="/agents/new">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-indigo-900 rounded-2xl
                       font-semibold text-lg shadow-2xl hover:shadow-indigo-500/50
                       transition-all"
            >
              ✨ Create New Agent
            </motion.button>
          </Link>
        </motion.div>

        {/* Agents Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-6xl"
            >
              ⚡
            </motion.div>
          </div>
        ) : agents.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {agents.map((agent: any) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </motion.div>
        ) : (
          <GlassCard className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No agents yet
            </h3>
            <p className="text-white/60 mb-6">
              Create your first AI agent to get started
            </p>
            <Link href="/agents/new">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-indigo-900 rounded-xl
                         font-semibold hover:shadow-lg transition-all"
              >
                Create Agent
              </motion.button>
            </Link>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

function AgentCard({ agent }: { agent: any }) {
  return (
    <motion.div
      variants={fadeIn}
      whileHover={{ y: -4 }}
    >
      <Link href={`/agents/${agent.id}`}>
        <GlassCard className="cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="text-5xl">{agent.avatar}</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">
                {agent.name}
              </h3>
              <p className="text-white/60 text-sm mb-4 line-clamp-2">
                {agent.description}
              </p>
              
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${
                  agent.is_active ? 'bg-green-400' : 'bg-gray-400'
                }`} />
                <span className="text-sm text-white/60">
                  {agent.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {agent.capabilities?.slice(0, 3).map((cap: any, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-white/10 text-white rounded-full text-xs"
                  >
                    {cap.icon} {cap.label}
                  </span>
                ))}
                {agent.capabilities?.length > 3 && (
                  <span className="px-2 py-1 bg-white/10 text-white rounded-full text-xs">
                    +{agent.capabilities.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}

