// Project Onboarding Service
// Manages AI-driven conversational project initialization

import { createClient } from '@/lib/supabase/client';
import type {
  ConversationContext,
  ConversationStage,
  ProjectRequirements,
  ProjectPlan,
  AIResponse,
  ConversationMessage,
} from '@/types/onboarding';

export class ProjectOnboardingService {
  private supabase = createClient();

  /**
   * Initialize a new project onboarding conversation
   */
  async initiateProject(projectId: string, projectName: string, initialPrompt: string): Promise<ConversationContext> {
    const context: ConversationContext = {
      projectId,
      projectName,
      initialPrompt,
      stage: 'GREETING',
      messages: [],
      requirements: {},
      conversationStartedAt: new Date(),
      lastUpdatedAt: new Date(),
    };

    // Generate initial greeting message
    const greetingMessage = this.generateGreeting(projectName, initialPrompt);
    
    context.messages.push({
      id: crypto.randomUUID(),
      role: 'ai',
      content: greetingMessage,
      timestamp: new Date(),
      metadata: {
        stage: 'GREETING',
        suggestedActions: [
          'Tell me about your project goals',
          'Start with a template',
          'Skip onboarding and build manually',
        ],
      },
    });

    // Save context to database
    await this.saveContext(context);

    return context;
  }

  /**
   * Continue the onboarding conversation
   */
  async continueConversation(
    userMessage: string,
    context: ConversationContext
  ): Promise<AIResponse> {
    // Add user message to context
    context.messages.push({
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    });

    // Process based on current stage
    let response: AIResponse;

    switch (context.stage) {
      case 'GREETING':
        response = await this.handleGreetingStage(userMessage, context);
        break;
      case 'GATHERING_REQUIREMENTS':
        response = await this.handleRequirementsGathering(userMessage, context);
        break;
      case 'CONFIRMING_PLAN':
        response = await this.handlePlanConfirmation(userMessage, context);
        break;
      case 'BUILDING':
        response = await this.handleBuildingStage(userMessage, context);
        break;
      default:
        response = {
          message: "I'm here to help! What would you like to do next?",
          stage: context.stage,
        };
    }

    // Update context with response
    context.messages.push({
      id: crypto.randomUUID(),
      role: 'ai',
      content: response.message,
      timestamp: new Date(),
      metadata: {
        stage: response.stage,
        requirementsGathered: response.requirementsUpdate,
        suggestedActions: response.suggestedActions,
      },
    });

    context.stage = response.stage;
    context.lastUpdatedAt = new Date();

    // Save updated context
    await this.saveContext(context);

    return response;
  }

  /**
   * Generate a welcoming greeting message
   */
  private generateGreeting(projectName: string, initialPrompt: string): string {
    return `Hey! 👋 I'm excited to help you build **${projectName}**!

I understand you want to create: *"${initialPrompt}"*

To get started, I need to understand a few things:

1. **What's the main purpose of this application?**
   (e.g., social media platform, e-commerce store, dashboard, portfolio, etc.)

2. **Who are your target users?**
   (e.g., general public, business users, specific community, etc.)

3. **What are the core features you need?**
   (e.g., user authentication, posts/comments, payments, real-time updates, etc.)

4. **Do you have any design preferences?**
   (e.g., modern/minimalist, colorful, professional, specific brand colors, etc.)

Feel free to answer these all at once, or we can go through them one by one. I'll create a detailed plan and start building once I understand your vision! 🚀

**Quick Options:**
- 📝 Answer all questions together
- 💬 Let's chat through it step by step
- 🎨 Start with a template and customize
- ⚡ Skip this and let me build from your original description`;
  }

  /**
   * Handle greeting stage responses
   */
  private async handleGreetingStage(
    userMessage: string,
    context: ConversationContext
  ): Promise<AIResponse> {
    const lowerMessage = userMessage.toLowerCase();

    // Check for skip request
    if (lowerMessage.includes('skip') || lowerMessage.includes('original description')) {
      return {
        message: `Got it! I'll start building based on your original description: "${context.initialPrompt}"

I'll create a basic structure for you. You can always customize it later!

**Starting to build:**
- Setting up project structure
- Creating main pages
- Adding basic components

This will take just a moment... ⚡`,
        stage: 'BUILDING',
        suggestedActions: ['View progress', 'Pause and review'],
      };
    }

    // Check for template request
    if (lowerMessage.includes('template')) {
      return {
        message: `Great! Let me suggest some templates based on your project:

**Recommended Templates:**
1. 🌐 Social Media Platform - Posts, comments, user profiles, real-time feeds
2. 🛍️ E-Commerce Store - Product catalog, cart, checkout, order management
3. 📊 Dashboard/Admin Panel - Analytics, data tables, charts, user management
4. 📱 Portfolio Website - Project showcase, about section, contact form
5. 💼 SaaS Application - User authentication, subscription tiers, admin dashboard

Which one sounds closest to what you're building? Or would you like to describe your vision in more detail?`,
        stage: 'GATHERING_REQUIREMENTS',
        suggestedActions: ['Choose template', 'Describe custom project'],
      };
    }

    // Move to requirements gathering
    const requirements = this.extractRequirements(userMessage);
    
    return {
      message: `Perfect! I'm getting a clearer picture. Let me make sure I understand:

${this.formatGatheredRequirements(requirements)}

${this.getNextQuestion(requirements)}`,
      stage: 'GATHERING_REQUIREMENTS',
      requirementsUpdate: requirements,
      suggestedActions: ['Continue answering', 'Review what I have', 'Move to planning'],
    };
  }

  /**
   * Handle requirements gathering stage
   */
  private async handleRequirementsGathering(
    userMessage: string,
    context: ConversationContext
  ): Promise<AIResponse> {
    // Extract and merge requirements
    const newRequirements = this.extractRequirements(userMessage);
    context.requirements = { ...context.requirements, ...newRequirements };

    // Check if we have enough information
    const completeness = this.checkRequirementsCompleteness(context.requirements);

    if (completeness >= 0.7) {
      // We have enough info, generate plan
      const plan = await this.generatePlan(context.requirements, context.projectName, context.initialPrompt);
      context.plan = plan;

      return {
        message: this.formatPlanSummary(plan),
        stage: 'CONFIRMING_PLAN',
        plan,
        planReady: true,
        suggestedActions: ['Looks good, start building!', 'I want to change something', 'Add more features'],
      };
    } else {
      // Ask for more information
      return {
        message: `Great! ${this.formatGatheredRequirements(context.requirements)}

${this.getNextQuestion(context.requirements)}`,
        stage: 'GATHERING_REQUIREMENTS',
        requirementsUpdate: context.requirements,
        suggestedActions: ['Continue', 'Show me what you have so far', 'Skip to planning'],
      };
    }
  }

  /**
   * Handle plan confirmation stage
   */
  private async handlePlanConfirmation(
    userMessage: string,
    context: ConversationContext
  ): Promise<AIResponse> {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('good') || lowerMessage.includes('start') || lowerMessage.includes('build')) {
      return {
        message: `Awesome! 🎉 Starting to build your ${context.projectName}...

**Build Progress:**
✓ Project structure initialized
⏳ Creating pages...
⏳ Setting up components...
⏳ Configuring database...

I'll keep you updated as I build each section!`,
        stage: 'BUILDING',
        plan: context.plan,
      };
    }

    if (lowerMessage.includes('change') || lowerMessage.includes('modify') || lowerMessage.includes('different')) {
      return {
        message: `No problem! What would you like to change?

**Current Plan:**
${context.plan ? this.formatPlanSummary(context.plan) : 'No plan yet'}

Tell me what you'd like to adjust, and I'll update the plan.`,
        stage: 'GATHERING_REQUIREMENTS',
        plan: context.plan,
        suggestedActions: ['Change features', 'Modify pages', 'Update design', 'Start over'],
      };
    }

    return {
      message: `I want to make sure this plan is exactly what you need!

${context.plan ? this.formatPlanSummary(context.plan) : ''}

Should I proceed with this plan, or would you like to make any adjustments?`,
      stage: 'CONFIRMING_PLAN',
      plan: context.plan,
      suggestedActions: ['Looks good, start building!', 'I want to change something', 'Show me templates'],
    };
  }

  /**
   * Handle building stage
   */
  private async handleBuildingStage(
    userMessage: string,
    context: ConversationContext
  ): Promise<AIResponse> {
    return {
      message: `I'm currently building your project! 🚀

**Progress:**
✓ Home page created
✓ Basic components added
⏳ Setting up database schema...
⏳ Configuring authentication...

You can ask me to:
- Pause and review what's built
- Add specific features
- Modify existing pages
- Deploy when ready

What would you like to do?`,
      stage: 'BUILDING',
    };
  }

  /**
   * Extract requirements from user message using simple keyword matching
   * In production, this would use actual AI/NLP
   */
  private extractRequirements(message: string): Partial<ProjectRequirements> {
    const requirements: Partial<ProjectRequirements> = {};
    const lowerMessage = message.toLowerCase();

    // Detect purpose
    if (lowerMessage.includes('social media') || lowerMessage.includes('social network')) {
      requirements.mainPurpose = 'Social Media Platform';
    } else if (lowerMessage.includes('ecommerce') || lowerMessage.includes('e-commerce') || lowerMessage.includes('store')) {
      requirements.mainPurpose = 'E-Commerce Store';
    } else if (lowerMessage.includes('dashboard') || lowerMessage.includes('admin')) {
      requirements.mainPurpose = 'Dashboard/Admin Panel';
    } else if (lowerMessage.includes('portfolio')) {
      requirements.mainPurpose = 'Portfolio Website';
    } else if (lowerMessage.includes('blog')) {
      requirements.mainPurpose = 'Blog Platform';
    }

    // Extract features
    const features: string[] = [];
    if (lowerMessage.includes('auth') || lowerMessage.includes('login') || lowerMessage.includes('signup')) {
      features.push('User Authentication');
    }
    if (lowerMessage.includes('post') || lowerMessage.includes('comment')) {
      features.push('Posts & Comments');
    }
    if (lowerMessage.includes('payment') || lowerMessage.includes('checkout')) {
      features.push('Payment Processing');
    }
    if (lowerMessage.includes('real-time') || lowerMessage.includes('realtime') || lowerMessage.includes('live')) {
      features.push('Real-time Updates');
    }
    if (lowerMessage.includes('profile') || lowerMessage.includes('user profile')) {
      features.push('User Profiles');
    }
    if (features.length > 0) {
      requirements.coreFeatures = features;
    }

    // Detect target users
    if (lowerMessage.includes('general public') || lowerMessage.includes('everyone')) {
      requirements.targetUsers = 'General Public';
    } else if (lowerMessage.includes('business') || lowerMessage.includes('companies')) {
      requirements.targetUsers = 'Business Users';
    }

    // Detect design preferences
    if (lowerMessage.includes('modern') || lowerMessage.includes('minimalist')) {
      requirements.designPreferences = 'Modern/Minimalist';
    } else if (lowerMessage.includes('colorful') || lowerMessage.includes('vibrant')) {
      requirements.designPreferences = 'Colorful/Vibrant';
    }

    return requirements;
  }

  /**
   * Check how complete the requirements are (0-1 scale)
   */
  private checkRequirementsCompleteness(requirements: ProjectRequirements): number {
    let score = 0;
    let total = 4;

    if (requirements.mainPurpose) score += 1;
    if (requirements.targetUsers) score += 1;
    if (requirements.coreFeatures && requirements.coreFeatures.length > 0) score += 1;
    if (requirements.designPreferences) score += 1;

    return score / total;
  }

  /**
   * Get next question based on what's missing
   */
  private getNextQuestion(requirements: ProjectRequirements): string {
    if (!requirements.mainPurpose) {
      return `**What's the main purpose of your application?**\n(e.g., social platform, online store, portfolio, etc.)`;
    }
    if (!requirements.targetUsers) {
      return `**Who will be using this application?**\n(e.g., general public, specific industry, internal team, etc.)`;
    }
    if (!requirements.coreFeatures || requirements.coreFeatures.length === 0) {
      return `**What are the must-have features?**\n(e.g., user accounts, payments, messaging, etc.)`;
    }
    if (!requirements.designPreferences) {
      return `**Any design preferences?**\n(e.g., modern, professional, playful, specific colors, etc.)`;
    }
    return `Great! I think I have enough to create a plan. Should I proceed?`;
  }

  /**
   * Format gathered requirements for display
   */
  private formatGatheredRequirements(requirements: ProjectRequirements): string {
    const parts: string[] = [];

    if (requirements.mainPurpose) {
      parts.push(`**Purpose:** ${requirements.mainPurpose}`);
    }
    if (requirements.targetUsers) {
      parts.push(`**Target Users:** ${requirements.targetUsers}`);
    }
    if (requirements.coreFeatures && requirements.coreFeatures.length > 0) {
      parts.push(`**Features:**\n${requirements.coreFeatures.map(f => `  - ${f}`).join('\n')}`);
    }
    if (requirements.designPreferences) {
      parts.push(`**Design:** ${requirements.designPreferences}`);
    }

    return parts.length > 0 ? `**What I understand so far:**\n${parts.join('\n')}` : '';
  }

  /**
   * Generate a project plan from requirements
   */
  private async generatePlan(
    requirements: ProjectRequirements,
    projectName: string,
    initialPrompt: string
  ): Promise<ProjectPlan> {
    // In production, this would use actual AI to generate the plan
    // For now, we'll create a smart template-based plan

    const plan: ProjectPlan = {
      projectName,
      projectType: requirements.mainPurpose || 'Web Application',
      targetUsers: requirements.targetUsers || 'General Users',
      coreFeatures: requirements.coreFeatures || [],
      pages: [],
      techStack: {
        database: true,
        authentication: requirements.coreFeatures?.includes('User Authentication') || false,
        payments: requirements.coreFeatures?.includes('Payment Processing') || false,
        realtime: requirements.coreFeatures?.includes('Real-time Updates') || false,
      },
    };

    // Generate pages based on project type
    plan.pages = this.generatePages(plan);

    return plan;
  }

  /**
   * Generate pages based on project plan
   */
  private generatePages(plan: ProjectPlan): import('@/types/onboarding').PagePlan[] {
    const pages: import('@/types/onboarding').PagePlan[] = [
      {
        name: 'Home',
        slug: 'home',
        purpose: 'Landing page and main entry point',
        components: ['Hero', 'Features', 'CTA'],
        priority: 'high',
      },
    ];

    if (plan.techStack.authentication) {
      pages.push({
        name: 'Dashboard',
        slug: 'dashboard',
        purpose: 'User dashboard after login',
        components: ['Stats', 'Recent Activity', 'Quick Actions'],
        priority: 'high',
      });
    }

    if (plan.projectType.includes('E-Commerce')) {
      pages.push(
        {
          name: 'Products',
          slug: 'products',
          purpose: 'Product catalog',
          components: ['Product Grid', 'Filters', 'Search'],
          priority: 'high',
        },
        {
          name: 'Cart',
          slug: 'cart',
          purpose: 'Shopping cart',
          components: ['Cart Items', 'Checkout Button'],
          priority: 'medium',
        }
      );
    }

    if (plan.projectType.includes('Social')) {
      pages.push(
        {
          name: 'Feed',
          slug: 'feed',
          purpose: 'Social media feed',
          components: ['Post List', 'Create Post', 'Filters'],
          priority: 'high',
        },
        {
          name: 'Profile',
          slug: 'profile',
          purpose: 'User profile page',
          components: ['User Info', 'Posts', 'Followers'],
          priority: 'high',
        }
      );
    }

    return pages;
  }

  /**
   * Format plan summary for display
   */
  private formatPlanSummary(plan: ProjectPlan): string {
    return `📋 **Here's what I understand:**

**Project:** ${plan.projectName}
**Type:** ${plan.projectType}
**Target Users:** ${plan.targetUsers}

**Core Features:**
${plan.coreFeatures.map(f => `  ✓ ${f}`).join('\n') || '  - Basic functionality'}

**Pages I'll create:**
${plan.pages.map((p, i) => `  ${i + 1}. ${p.name} - ${p.purpose}`).join('\n')}

**Tech Stack:**
${plan.techStack.database ? '  ✓ Database (Supabase)\n' : ''}${plan.techStack.authentication ? '  ✓ User Authentication\n' : ''}${plan.techStack.payments ? '  ✓ Payment Processing\n' : ''}${plan.techStack.realtime ? '  ✓ Real-time Updates\n' : ''}
Does this look good? Should I adjust anything before I start building?`;
  }

  /**
   * Save conversation context to database
   */
  private async saveContext(context: ConversationContext): Promise<void> {
    const { data: project } = await this.supabase
      .from('projects')
      .select('ai_metadata')
      .eq('id', context.projectId)
      .single();

    await this.supabase
      .from('projects')
      .update({
        ai_metadata: {
          ...(project?.ai_metadata || {}),
          onboarding_context: {
            stage: context.stage,
            requirements: context.requirements,
            plan: context.plan,
            conversationStartedAt: context.conversationStartedAt,
            lastUpdatedAt: context.lastUpdatedAt,
          },
          conversation_history: context.messages,
        },
      })
      .eq('id', context.projectId);
  }

  /**
   * Load existing conversation context
   */
  async loadContext(projectId: string): Promise<ConversationContext | null> {
    const { data: project } = await this.supabase
      .from('projects')
      .select('name, description, ai_prompt, ai_metadata')
      .eq('id', projectId)
      .single();

    if (!project || !project.ai_metadata?.onboarding_context) {
      return null;
    }

    const savedContext = project.ai_metadata.onboarding_context;

    return {
      projectId,
      projectName: project.name,
      initialPrompt: project.ai_prompt || project.description || '',
      stage: savedContext.stage || 'GREETING',
      messages: project.ai_metadata.conversation_history || [],
      requirements: savedContext.requirements || {},
      plan: savedContext.plan,
      conversationStartedAt: savedContext.conversationStartedAt ? new Date(savedContext.conversationStartedAt) : undefined,
      lastUpdatedAt: savedContext.lastUpdatedAt ? new Date(savedContext.lastUpdatedAt) : new Date(),
    };
  }

  /**
   * Check if project is new (no pages created yet)
   */
  async isNewProject(projectId: string): Promise<boolean> {
    const { data: pages } = await this.supabase
      .from('pages')
      .select('id')
      .eq('project_id', projectId)
      .limit(1);

    return !pages || pages.length === 0;
  }
}

// Export singleton instance
export const projectOnboardingService = new ProjectOnboardingService();

