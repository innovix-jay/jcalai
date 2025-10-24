import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

type AIProvider = 'claude' | 'gpt' | 'gemini' | 'auto';
type TaskType = 'architecture' | 'ui-design' | 'backend' | 'debugging' | 'optimization' | 'database' | 'testing';

interface AIModel {
  provider: AIProvider;
  model: string;
  strengths: TaskType[];
  costPerToken: number;
  speedRating: number; // 1-10
  qualityRating: number; // 1-10
}

const AI_MODELS: Record<string, AIModel> = {
  'claude-sonnet-4.5': {
    provider: 'claude',
    model: 'claude-sonnet-4-5-20250929',
    strengths: ['architecture', 'backend', 'debugging', 'optimization'],
    costPerToken: 0.000015,
    speedRating: 8,
    qualityRating: 10
  },
  'gpt-4o': {
    provider: 'gpt',
    model: 'gpt-4o',
    strengths: ['ui-design', 'testing'],
    costPerToken: 0.000005,
    speedRating: 9,
    qualityRating: 9
  },
  'gemini-2.0': {
    provider: 'gemini',
    model: 'gemini-2.0-flash-exp',
    strengths: ['database', 'optimization', 'debugging'],
    costPerToken: 0.000001,
    speedRating: 10,
    qualityRating: 8
  }
};

export class MultiAIOrchestrator {
  private claude: Anthropic;
  private openai: OpenAI;
  private gemini: GoogleGenerativeAI;

  constructor() {
    this.claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    this.gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  }

  /**
   * Automatically selects the best AI model for the given task
   */
  selectBestModel(taskType: TaskType, prioritize: 'speed' | 'quality' | 'cost' = 'quality'): AIModel {
    const candidates = Object.values(AI_MODELS).filter(model => 
      model.strengths.includes(taskType)
    );

    if (candidates.length === 0) {
      return AI_MODELS['claude-sonnet-4.5']; // Default to Claude
    }

    // Sort by priority
    const sorted = candidates.sort((a, b) => {
      if (prioritize === 'speed') return b.speedRating - a.speedRating;
      if (prioritize === 'cost') return a.costPerToken - b.costPerToken;
      return b.qualityRating - a.qualityRating;
    });

    return sorted[0];
  }

  /**
   * Execute a prompt with automatic model selection
   */
  async execute(
    prompt: string,
    taskType: TaskType,
    options: {
      provider?: AIProvider;
      systemPrompt?: string;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<{ response: string; model: string; provider: AIProvider; cost: number }> {
    let model: AIModel;
    
    if (options.provider && options.provider !== 'auto') {
      // User specified provider
      model = Object.values(AI_MODELS).find(m => m.provider === options.provider)!;
    } else {
      // Auto-select best model
      model = this.selectBestModel(taskType);
    }

    const startTime = Date.now();
    let response: string;
    let tokensUsed = 0;

    try {
      switch (model.provider) {
        case 'claude':
          const claudeResult = await this.executeClaude(prompt, model.model, options);
          response = claudeResult.response;
          tokensUsed = claudeResult.tokens;
          break;

        case 'gpt':
          const gptResult = await this.executeGPT(prompt, model.model, options);
          response = gptResult.response;
          tokensUsed = gptResult.tokens;
          break;

        case 'gemini':
          const geminiResult = await this.executeGemini(prompt, model.model, options);
          response = geminiResult.response;
          tokensUsed = geminiResult.tokens;
          break;

        default:
          throw new Error(`Unknown provider: ${model.provider}`);
      }

      const executionTime = Date.now() - startTime;
      const cost = tokensUsed * model.costPerToken;

      // Log for analytics
      await this.logExecution({
        provider: model.provider,
        model: model.model,
        taskType,
        tokensUsed,
        cost,
        executionTime
      });

      return {
        response,
        model: model.model,
        provider: model.provider,
        cost
      };

    } catch (error) {
      console.error(`Error with ${model.provider}:`, error);
      
      // Fallback to Claude if primary fails
      if (model.provider !== 'claude') {
        console.log('Falling back to Claude...');
        return this.execute(prompt, taskType, { ...options, provider: 'claude' });
      }
      
      throw error;
    }
  }

  /**
   * Execute with multiple models and compare results
   */
  async executeMultiple(
    prompt: string,
    taskType: TaskType,
    providers: AIProvider[] = ['claude', 'gpt', 'gemini']
  ): Promise<{
    results: Array<{ provider: AIProvider; response: string; cost: number; time: number }>;
    consensus?: string;
    differences: string[];
  }> {
    const startTime = Date.now();
    
    const results = await Promise.all(
      providers.map(async (provider) => {
        const providerStart = Date.now();
        const result = await this.execute(prompt, taskType, { provider });
        return {
          provider: result.provider,
          response: result.response,
          cost: result.cost,
          time: Date.now() - providerStart
        };
      })
    );

    // Analyze differences
    const differences = this.analyzeDifferences(results.map(r => r.response));

    // Generate consensus if needed
    let consensus: string | undefined;
    if (differences.length > 0) {
      consensus = await this.generateConsensus(results);
    }

    return { results, consensus, differences };
  }

  /**
   * AI Team Mode: Multiple specialized agents work together
   */
  async teamMode(
    projectGoal: string,
    projectContext: any
  ): Promise<{
    plan: string;
    assignments: Array<{ agent: string; task: string; model: string }>;
    results: any[];
  }> {
    // Step 1: Architect plans the project
    const architectModel = this.selectBestModel('architecture');
    const planResult = await this.execute(
      `You are a senior software architect. Plan this project:

PROJECT GOAL: ${projectGoal}
CONTEXT: ${JSON.stringify(projectContext, null, 2)}

Create a detailed implementation plan with specific tasks. Return JSON:
{
  "plan": "Overall strategy and architecture",
  "tasks": [
    {
      "id": "task-1",
      "description": "Task description",
      "type": "frontend" | "backend" | "database" | "testing",
      "assignTo": "frontend-specialist" | "backend-specialist" | "database-specialist"
    }
  ]
}`,
      'architecture',
      { provider: architectModel.provider }
    );

    const plan = JSON.parse(planResult.response);

    // Step 2: Assign tasks to specialized agents
    const assignments = plan.tasks.map((task: any) => {
      let agent: string;
      let taskType: TaskType;

      switch (task.type) {
        case 'frontend':
          agent = 'UI Specialist';
          taskType = 'ui-design';
          break;
        case 'backend':
          agent = 'Backend Specialist';
          taskType = 'backend';
          break;
        case 'database':
          agent = 'Database Specialist';
          taskType = 'database';
          break;
        default:
          agent = 'Generalist';
          taskType = 'architecture';
      }

      const model = this.selectBestModel(taskType);

      return {
        taskId: task.id,
        agent,
        task: task.description,
        model: model.model,
        provider: model.provider,
        taskType
      };
    });

    // Step 3: Execute tasks in parallel
    const results = await Promise.all(
      assignments.map(async (assignment) => {
        const result = await this.execute(
          `You are a ${assignment.agent}. Complete this task:

TASK: ${assignment.task}
PROJECT CONTEXT: ${JSON.stringify(projectContext, null, 2)}

Provide complete implementation code and explanation.`,
          assignment.taskType,
          { provider: assignment.provider as AIProvider }
        );

        return {
          taskId: assignment.taskId,
          agent: assignment.agent,
          result: result.response,
          model: result.model
        };
      })
    );

    // Step 4: Integration pass - have architect review and integrate
    const integrationResult = await this.execute(
      `You are the architect. Review these completed tasks and create an integrated solution:

ORIGINAL PLAN: ${plan.plan}
COMPLETED TASKS: ${JSON.stringify(results, null, 2)}

Integrate everything into a cohesive implementation. Return the complete integrated code.`,
      'architecture',
      { provider: 'claude' }
    );

    return {
      plan: plan.plan,
      assignments,
      results: [...results, {
        taskId: 'integration',
        agent: 'Architect',
        result: integrationResult.response,
        model: integrationResult.model
      }]
    };
  }

  private async executeClaude(prompt: string, model: string, options: any) {
    const response = await this.claude.messages.create({
      model,
      max_tokens: options.maxTokens || 4000,
      temperature: options.temperature || 0.7,
      system: options.systemPrompt,
      messages: [{ role: 'user', content: prompt }]
    });

    return {
      response: response.content[0].type === 'text' ? response.content[0].text : '',
      tokens: response.usage.input_tokens + response.usage.output_tokens
    };
  }

  private async executeGPT(prompt: string, model: string, options: any) {
    const messages: any[] = [];
    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await this.openai.chat.completions.create({
      model,
      messages,
      max_tokens: options.maxTokens || 4000,
      temperature: options.temperature || 0.7
    });

    return {
      response: response.choices[0].message.content || '',
      tokens: response.usage?.total_tokens || 0
    };
  }

  private async executeGemini(prompt: string, model: string, options: any) {
    const geminiModel = this.gemini.getGenerativeModel({ model });
    
    const result = await geminiModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 4000
      }
    });

    return {
      response: result.response.text(),
      tokens: result.response.usageMetadata?.totalTokenCount || 0
    };
  }

  private analyzeDifferences(responses: string[]): string[] {
    // Simple difference analysis - could be enhanced with NLP
    const differences: string[] = [];
    
    // Check for significant differences in approach
    if (responses.length > 1) {
      const lengths = responses.map(r => r.length);
      const avgLength = lengths.reduce((a, b) => a + b) / lengths.length;
      
      lengths.forEach((len, i) => {
        if (Math.abs(len - avgLength) > avgLength * 0.3) {
          differences.push(`Response ${i + 1} significantly different length`);
        }
      });
    }

    return differences;
  }

  private async generateConsensus(results: any[]): Promise<string> {
    const consensusPrompt = `Review these different AI responses and create a consensus solution that takes the best from each:

${results.map((r, i) => `
RESPONSE ${i + 1} (from ${r.provider}):
${r.response}
`).join('\n---\n')}

Create a unified, best-of-all solution.`;

    const consensus = await this.execute(consensusPrompt, 'architecture', { provider: 'claude' });
    return consensus.response;
  }

  private async logExecution(data: any) {
    // Log to database for analytics
    // Track cost, performance, model usage over time
    console.log('[AI Orchestrator] Execution logged:', data);
  }
}
