// AI-Powered Project Onboarding Service
// Uses real LLM APIs (Claude, OpenAI, Gemini) for intelligent conversation

import { createClient } from '@/lib/supabase/client';
import { modelRouter, type AIProvider } from '@/lib/ai/model-router';
import type {
  ConversationContext,
  ConversationStage,
  ProjectRequirements,
  ProjectPlan,
  AIResponse,
  ConversationMessage,
} from '@/types/onboarding';

export class AIOnboardingService {
  private supabase = createClient();
  private selectedModel: AIProvider = 'auto';

  /**
   * Set the preferred AI model
   */
  setModel(model: AIProvider) {
    this.selectedModel = model;
  }

  /**
   * Initialize a new project onboarding conversation
   */
  async initiateProject(
    projectId: string,
    projectName: string,
    initialPrompt: string,
    selectedModel?: AIProvider
  ): Promise<ConversationContext> {
    if (selectedModel) {
      this.selectedModel = selectedModel;
    }

    // Create system prompt for the AI
    const systemPrompt = `You are an expert AI assistant helping users build their web applications on the JCAL.ai platform. Your role is to:

1. Have a natural, friendly conversation to understand their project needs
2. Ask clarifying questions about:
   - What they want to build (purpose/vision)
   - Who will use it (target users)
   - What features they need (core functionality)
   - Design preferences (if any)
3. Extract structured requirements from the conversation
4. Eventually generate a comprehensive project plan

Be conversational, enthusiastic, and helpful. Ask follow-up questions naturally. Don't be robotic or use numbered lists unless listing project features.

User's initial idea: "${initialPrompt}"
Project name: "${projectName}"

Start by warmly greeting them and asking about their vision for this project. Keep your first message under 100 words.`;

    try {
      // Generate initial greeting using AI
      console.log('[AI Onboarding] Generating greeting with model:', this.selectedModel);
      const greetingResponse = await modelRouter.generate(systemPrompt, 'general', this.selectedModel);
      console.log('[AI Onboarding] Greeting generated successfully');

      const context: ConversationContext = {
        projectId,
        projectName,
        initialPrompt,
        stage: 'GREETING',
        messages: [
          {
            id: crypto.randomUUID(),
            role: 'ai',
            content: greetingResponse.response,
            timestamp: new Date(),
            metadata: {
              stage: 'GREETING',
              suggestedActions: [
                'Tell me your goals',
                'Start with a template',
                'I have a detailed plan',
              ],
            },
          },
        ],
        requirements: {},
        conversationStartedAt: new Date(),
        lastUpdatedAt: new Date(),
      };

      // Save context to database
      await this.saveContext(context);

      return context;
    } catch (error: any) {
      console.error('[AI Onboarding] INITIATION ERROR:', error);
      console.error('[AI Onboarding] Error details:', error.message, error.stack);
      // Fallback to friendly default if AI fails
      const context: ConversationContext = {
        projectId,
        projectName,
        initialPrompt,
        stage: 'GREETING',
        messages: [
          {
            id: crypto.randomUUID(),
            role: 'ai',
            content: `Hey! 👋 I'm excited to help you build **${projectName}**! I see you want to create something around: *"${initialPrompt}"*\n\nTell me more about your vision - what's the main goal of this project, and who do you see using it?`,
            timestamp: new Date(),
            metadata: {
              stage: 'GREETING',
              suggestedActions: ['Tell me your goals', 'Start with a template'],
            },
          },
        ],
        requirements: {},
        conversationStartedAt: new Date(),
        lastUpdatedAt: new Date(),
      };

      await this.saveContext(context);
      return context;
    }
  }

  /**
   * Continue the onboarding conversation using real AI
   */
  async continueConversation(
    userMessage: string,
    context: ConversationContext,
    selectedModel?: AIProvider
  ): Promise<AIResponse> {
    if (selectedModel) {
      this.selectedModel = selectedModel;
    }

    // Add user message to context
    context.messages.push({
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    });

    // Build conversation history for AI
    const conversationHistory = context.messages
      .map((msg) => `${msg.role === 'ai' ? 'Assistant' : 'User'}: ${msg.content}`)
      .join('\n\n');

    // Create context-aware system prompt based on stage
    const systemPrompt = this.buildSystemPrompt(context, conversationHistory, userMessage);

    try {
      // Get AI response
      const aiResponse = await modelRouter.generate(
        systemPrompt,
        this.getTaskType(context.stage),
        this.selectedModel
      );

      // Parse AI response to extract stage, actions, and requirements
      const parsed = this.parseAIResponse(aiResponse.response, context);

      // Add AI message to context
      context.messages.push({
        id: crypto.randomUUID(),
        role: 'ai',
        content: parsed.message,
        timestamp: new Date(),
        metadata: {
          stage: parsed.stage,
          requirementsGathered: parsed.requirementsUpdate,
          suggestedActions: parsed.suggestedActions,
        },
      });

      // Update context
      if (parsed.requirementsUpdate) {
        context.requirements = { ...context.requirements, ...parsed.requirementsUpdate };
      }
      context.stage = parsed.stage;
      context.lastUpdatedAt = new Date();

      // Save updated context
      await this.saveContext(context);

      return parsed;
    } catch (error) {
      console.error('AI conversation error:', error);
      
      // Fallback response
      const fallbackResponse: AIResponse = {
        message: "I'm having trouble processing that. Could you tell me more about what you want to build?",
        stage: context.stage,
      };

      context.messages.push({
        id: crypto.randomUUID(),
        role: 'ai',
        content: fallbackResponse.message,
        timestamp: new Date(),
      });

      await this.saveContext(context);
      return fallbackResponse;
    }
  }

  /**
   * Build system prompt based on conversation stage
   */
  private buildSystemPrompt(
    context: ConversationContext,
    conversationHistory: string,
    userMessage: string
  ): string {
    const baseContext = `You are helping build a project called "${context.projectName}". Initial idea: "${context.initialPrompt}".

Current conversation:
${conversationHistory}

Current requirements gathered:
${JSON.stringify(context.requirements, null, 2)}

Current stage: ${context.stage}`;

    switch (context.stage) {
      case 'GREETING':
      case 'GATHERING_REQUIREMENTS':
        return `${baseContext}

Your job: Extract project requirements from the user's message and continue the conversation naturally.

User's latest message: "${userMessage}"

Respond with:
1. Acknowledge what they said
2. Extract any requirements (purpose, users, features, design preferences)
3. Ask 1-2 relevant follow-up questions
4. If you have enough info (purpose + users + at least 2 features), suggest moving to planning

Format your response as JSON:
{
  "message": "Your conversational response here",
  "stage": "GATHERING_REQUIREMENTS" or "CONFIRMING_PLAN",
  "requirementsUpdate": {
    "mainPurpose": "...",
    "targetUsers": "...",
    "coreFeatures": ["...", "..."],
    "designPreferences": "..."
  },
  "suggestedActions": ["Action 1", "Action 2"],
  "planReady": true/false
}

Keep your message friendly and under 150 words.`;

      case 'CONFIRMING_PLAN':
        return `${baseContext}

The user is reviewing a project plan. Their latest message: "${userMessage}"

Determine if they:
- Want to proceed with building (contains words like "yes", "build", "start", "good", "looks great")
- Want to modify something (contains "change", "modify", "different", "add", "remove")
- Need more information

Respond with JSON:
{
  "message": "Your response",
  "stage": "BUILDING" if proceeding, "GATHERING_REQUIREMENTS" if modifying, "CONFIRMING_PLAN" if clarifying,
  "plan": only include if generating a new plan
}`;

      default:
        return `${baseContext}

User message: "${userMessage}"

Respond helpfully about the current stage (${context.stage}).

JSON format:
{
  "message": "Your response",
  "stage": "${context.stage}"
}`;
    }
  }

  /**
   * Parse AI JSON response
   */
  private parseAIResponse(aiResponse: string, context: ConversationContext): AIResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          message: parsed.message || aiResponse,
          stage: parsed.stage || context.stage,
          requirementsUpdate: parsed.requirementsUpdate,
          suggestedActions: parsed.suggestedActions,
          planReady: parsed.planReady,
          plan: parsed.plan,
        };
      }
    } catch (error) {
      console.error('JSON parse error:', error);
    }

    // Fallback: use the whole response as message
    return {
      message: aiResponse,
      stage: context.stage,
    };
  }

  /**
   * Get task type for AI model selection
   */
  private getTaskType(stage: ConversationStage): 'scaffold' | 'general' {
    if (stage === 'CONFIRMING_PLAN') {
      return 'scaffold';
    }
    return 'general';
  }

  /**
   * Generate project plan from requirements using AI
   */
  async generatePlan(context: ConversationContext): Promise<ProjectPlan> {
    const planPrompt = `Based on these project requirements, generate a comprehensive project plan:

Project: ${context.projectName}
Initial idea: ${context.initialPrompt}
Requirements: ${JSON.stringify(context.requirements, null, 2)}

Generate a detailed project plan in JSON format:
{
  "projectName": "${context.projectName}",
  "projectType": "Category (e.g., E-Commerce, Social Media, Dashboard)",
  "targetUsers": "Who will use it",
  "coreFeatures": ["Feature 1", "Feature 2", ...],
  "pages": [
    {
      "name": "Page Name",
      "slug": "url-slug",
      "purpose": "Why this page exists",
      "components": ["Component1", "Component2"],
      "priority": "high/medium/low"
    }
  ],
  "techStack": {
    "database": true,
    "authentication": true/false,
    "payments": true/false,
    "realtime": true/false
  }
}

Make the plan comprehensive with 4-8 pages.`;

    try {
      const response = await modelRouter.generate(planPrompt, 'scaffold', this.selectedModel);
      const jsonMatch = response.response.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const plan = JSON.parse(jsonMatch[0]);
        context.plan = plan;
        await this.saveContext(context);
        return plan;
      }
    } catch (error) {
      console.error('Plan generation error:', error);
    }

    // Fallback plan
    return this.generateFallbackPlan(context);
  }

  /**
   * Generate a fallback plan if AI fails
   */
  private generateFallbackPlan(context: ConversationContext): ProjectPlan {
    return {
      projectName: context.projectName,
      projectType: context.requirements.mainPurpose || 'Web Application',
      targetUsers: context.requirements.targetUsers || 'General Users',
      coreFeatures: context.requirements.coreFeatures || ['User Interface', 'Data Management'],
      pages: [
        {
          name: 'Home',
          slug: 'home',
          purpose: 'Main landing page',
          components: ['Hero', 'Features', 'CTA'],
          priority: 'high',
        },
        {
          name: 'Dashboard',
          slug: 'dashboard',
          purpose: 'User dashboard',
          components: ['Stats', 'Activity Feed'],
          priority: 'high',
        },
      ],
      techStack: {
        database: true,
        authentication: true,
        payments: false,
        realtime: false,
      },
    };
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
      conversationStartedAt: savedContext.conversationStartedAt
        ? new Date(savedContext.conversationStartedAt)
        : undefined,
      lastUpdatedAt: savedContext.lastUpdatedAt ? new Date(savedContext.lastUpdatedAt) : new Date(),
    };
  }
}

// Export singleton instance
export const aiOnboardingService = new AIOnboardingService();

