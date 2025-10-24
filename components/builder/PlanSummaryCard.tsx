'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CheckCircle, Sparkles, X, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import type { ProjectPlan } from '@/types/onboarding';

interface PlanSummaryCardProps {
  plan: ProjectPlan;
  onConfirm: () => void;
  onModify: () => void;
  onClose?: () => void;
  isBuilding?: boolean;
}

export function PlanSummaryCard({
  plan,
  onConfirm,
  onModify,
  onClose,
  isBuilding = false,
}: PlanSummaryCardProps) {
  const [expandedSections, setExpandedSections] = useState({
    features: true,
    pages: true,
    techStack: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto
                   bg-white dark:bg-gray-900 rounded-3xl shadow-2xl
                   relative"
        style={{
          background: 'linear-gradient(to bottom right, white, rgb(249, 250, 251))',
        }}
      >
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 -z-10 opacity-50" />

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        )}

        <div className="p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl"
            >
              📋
            </motion.div>
            <div className="flex-1">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
              >
                Your Project Plan
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 dark:text-gray-400"
              >
                Review and confirm before I start building
              </motion.p>
            </div>
          </div>

          {/* Project Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <InfoCard label="Project Name" value={plan.projectName} icon="🎯" delay={0.3} />
            <InfoCard label="Project Type" value={plan.projectType} icon="📱" delay={0.35} />
            <InfoCard label="Target Users" value={plan.targetUsers} icon="👥" delay={0.4} />
            <InfoCard
              label="Estimated Pages"
              value={`${plan.pages.length} pages`}
              icon="📄"
              delay={0.45}
            />
          </div>

          {/* Core Features */}
          <Section
            title="Core Features"
            icon="✨"
            isExpanded={expandedSections.features}
            onToggle={() => toggleSection('features')}
            delay={0.5}
          >
            <div className="space-y-2">
              {plan.coreFeatures.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-800 dark:text-gray-200">{feature}</span>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* Pages */}
          <Section
            title="Pages I'll Create"
            icon="📄"
            isExpanded={expandedSections.pages}
            onToggle={() => toggleSection('pages')}
            delay={0.55}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plan.pages.map((page, i) => (
                <PageCard key={i} page={page} index={i} />
              ))}
            </div>
          </Section>

          {/* Tech Stack */}
          <Section
            title="Tech Stack"
            icon="⚙️"
            isExpanded={expandedSections.techStack}
            onToggle={() => toggleSection('techStack')}
            delay={0.6}
          >
            <div className="flex flex-wrap gap-3">
              <TechBadge icon="🗄️" label="Database (Supabase)" active={plan.techStack.database} delay={0.7} />
              <TechBadge icon="🔐" label="Authentication" active={plan.techStack.authentication} delay={0.75} />
              <TechBadge icon="💳" label="Payments" active={plan.techStack.payments} delay={0.8} />
              <TechBadge icon="⚡" label="Real-time" active={plan.techStack.realtime} delay={0.85} />
              <TechBadge icon="🎨" label="Tailwind CSS" active={true} delay={0.9} />
              <TechBadge icon="⚛️" label="React/Next.js" active={true} delay={0.95} />
            </div>
          </Section>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <motion.button
              onClick={onConfirm}
              disabled={isBuilding}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600
                       text-white rounded-2xl font-semibold text-lg
                       shadow-lg hover:shadow-xl transition-all
                       flex items-center justify-center gap-3
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBuilding ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                  />
                  <span>Building...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>Start Building! 🚀</span>
                </>
              )}
            </motion.button>

            <motion.button
              onClick={onModify}
              disabled={isBuilding}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-2xl
                       hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors
                       font-semibold flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Edit className="w-5 h-5" />
              <span>Modify Plan</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Info Card Component
function InfoCard({
  label,
  value,
  icon,
  delay = 0,
}: {
  label: string;
  value: string;
  icon: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      </div>
      <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
    </motion.div>
  );
}

// Section Component
function Section({
  title,
  icon,
  children,
  isExpanded,
  onToggle,
  delay = 0,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mb-6"
    >
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-3"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Page Card Component
function PageCard({ page, index }: { page: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.65 + index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 dark:text-white">{page.name}</h4>
        <span
          className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${page.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
          ${page.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
          ${page.priority === 'low' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
        `}
        >
          {page.priority}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{page.purpose}</p>
      {page.components && page.components.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {page.components.map((comp: string, i: number) => (
            <span
              key={i}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
            >
              {comp}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Tech Badge Component
function TechBadge({
  icon,
  label,
  active,
  delay = 0,
}: {
  icon: string;
  label: string;
  active?: boolean;
  delay?: number;
}) {
  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
      className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600
                 text-white rounded-full text-sm font-medium
                 shadow-md hover:shadow-lg transition-shadow
                 flex items-center gap-2"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </motion.div>
  );
}

