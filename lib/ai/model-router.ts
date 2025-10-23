/**
 * AI Model Router - Intelligent routing between Claude, OpenAI, and Gemini
 * Automatically selects the best model based on prompt complexity and task type
 */

export type AIProvider = 'claude' | 'openai' | 'gemini' | 'gemini-pro' | 'auto';
export type TaskType = 'scaffold' | 'component' | 'page' | 'api' | 'database' | 'code' | 'general';

export interface ModelCapabilities {
  contextWindow: number;
  costPerToken: number;
  strengthAreas: string[];
  weaknessAreas: string[];
  speed: 'fast' | 'medium' | 'slow';
  quality: 'high' | 'medium' | 'low';
}

export interface AIModelConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
  capabilities: ModelCapabilities;
}

export interface PromptAnalysis {
  complexity: 'low' | 'medium' | 'high';
  taskType: TaskType;
  estimatedTokens: number;
  requiresContext: boolean;
  requiresCodeGeneration: boolean;
  requiresCreativity: boolean;
}

export interface ModelSelection {
  provider: AIProvider;
  model: string;
  reasoning: string;
  estimatedCost: number;
  estimatedTime: number;
}

export class AIModelRouter {
  private models: Map<AIProvider, AIModelConfig>;

  constructor() {
    this.models = new Map();
    this.initializeModels();
  }

  private initializeModels() {
    // Claude 4.5 Sonnet (latest as of Oct 2025 - default on Claude.ai)
    this.models.set('claude', {
      provider: 'claude',
      model: 'claude-4.5-sonnet',
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      capabilities: {
        contextWindow: 200000,
        costPerToken: 0.003 / 1000, // $3 per million tokens
        strengthAreas: ['code_generation', 'complex_reasoning', 'long_context', 'architecture'],
        weaknessAreas: ['image_generation'],
        speed: 'medium',
        quality: 'high',
      },
    });

    // OpenAI GPT-5 (flagship reasoning and multimodal model, Oct 2025)
    this.models.set('openai', {
      provider: 'openai',
      model: 'gpt-5',
      apiKey: process.env.OPENAI_API_KEY || '',
      capabilities: {
        contextWindow: 200000,
        costPerToken: 0.01 / 1000, // $10 per million tokens
        strengthAreas: ['general_purpose', 'creativity', 'multimodal', 'fast_responses', 'reasoning'],
        weaknessAreas: ['very_long_context'],
        speed: 'fast',
        quality: 'high',
      },
    });

    // Gemini 1.5 Flash (lightweight high-speed generation - default for manual selection)
    this.models.set('gemini', {
      provider: 'gemini',
      model: 'gemini-1.5-flash',
      apiKey: process.env.GOOGLE_API_KEY || '',
      capabilities: {
        contextWindow: 1000000,
        costPerToken: 0.00075 / 1000, // $0.75 per million tokens (most cost-effective)
        strengthAreas: ['massive_context', 'cost_effective', 'multimodal', 'speed'],
        weaknessAreas: [],
        speed: 'fast',
        quality: 'high',
      },
    });

    // Gemini 2.5 Pro (reasoning, code, STEM - Oct 2025, available for auto-select)
    this.models.set('gemini-pro', {
      provider: 'gemini-pro',
      model: 'gemini-2.5-pro',
      apiKey: process.env.GOOGLE_API_KEY || '',
      capabilities: {
        contextWindow: 1000000,
        costPerToken: 0.00125 / 1000, // $1.25 per million tokens
        strengthAreas: ['reasoning', 'code_generation', 'STEM', 'document_analysis', 'massive_context'],
        weaknessAreas: [],
        speed: 'medium',
        quality: 'high',
      },
    });
  }

  /**
   * Analyze a prompt to determine its characteristics
   */
  analyzePrompt(prompt: string, taskType: TaskType): PromptAnalysis {
    const wordCount = prompt.split(/\s+/).length;
    const codeKeywords = ['function', 'class', 'component', 'api', 'database', 'schema', 'endpoint'];
    const complexityKeywords = ['complex', 'advanced', 'sophisticated', 'intricate', 'comprehensive'];
    const creativeKeywords = ['creative', 'design', 'beautiful', 'modern', 'innovative'];

    const hasCodeKeywords = codeKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
    const hasComplexityKeywords = complexityKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
    const hasCreativeKeywords = creativeKeywords.some(keyword => prompt.toLowerCase().includes(keyword));

    // Estimate complexity based on multiple factors
    let complexity: 'low' | 'medium' | 'high' = 'low';
    if (wordCount > 100 || hasComplexityKeywords) {
      complexity = 'high';
    } else if (wordCount > 50 || hasCodeKeywords) {
      complexity = 'medium';
    }

    return {
      complexity,
      taskType,
      estimatedTokens: Math.ceil(wordCount * 1.3), // Rough token estimation
      requiresContext: complexity === 'high' || taskType === 'scaffold',
      requiresCodeGeneration: hasCodeKeywords || ['scaffold', 'component', 'api', 'database'].includes(taskType),
      requiresCreativity: hasCreativeKeywords || taskType === 'component',
    };
  }

  /**
   * Select the best model for a given prompt and task
   */
  selectModel(prompt: string, taskType: TaskType, userPreference?: AIProvider): ModelSelection {
    const analysis = this.analyzePrompt(prompt, taskType);

    // If user has a preference and it's not auto, use it
    if (userPreference && userPreference !== 'auto') {
      const config = this.models.get(userPreference);
      if (config) {
        return {
          provider: userPreference,
          model: config.model,
          reasoning: 'User-selected model',
          estimatedCost: analysis.estimatedTokens * config.capabilities.costPerToken,
          estimatedTime: this.estimateTime(config.capabilities.speed, analysis.complexity),
        };
      }
    }

    // Auto-selection logic based on task characteristics
    let selectedProvider: AIProvider = 'claude'; // Default

    // Decision tree for model selection
    if (taskType === 'scaffold' || taskType === 'database') {
      // Complex architecture tasks - use Claude for best code generation
      selectedProvider = 'claude';
    } else if (taskType === 'component' && analysis.requiresCreativity) {
      // Creative UI components - OpenAI for better design creativity
      selectedProvider = 'openai';
    } else if (analysis.estimatedTokens > 50000) {
      // Very large context - use Gemini 2.5 Pro for reasoning + context
      selectedProvider = 'gemini-pro';
    } else if (analysis.complexity === 'high' && analysis.requiresCodeGeneration) {
      // Complex code generation - use Gemini 2.5 Pro for reasoning
      selectedProvider = 'gemini-pro';
    } else if (analysis.complexity === 'low' || taskType === 'general') {
      // Simple tasks - use Gemini Flash for speed and cost
      selectedProvider = 'gemini';
    } else if (taskType === 'api' || taskType === 'code') {
      // Backend logic and API - Claude for robust code
      selectedProvider = 'claude';
    } else {
      // Default to Gemini Flash for balanced performance and cost
      selectedProvider = 'gemini';
    }

    const config = this.models.get(selectedProvider)!;

    return {
      provider: selectedProvider,
      model: config.model,
      reasoning: this.generateReasoning(selectedProvider, analysis, taskType),
      estimatedCost: analysis.estimatedTokens * config.capabilities.costPerToken,
      estimatedTime: this.estimateTime(config.capabilities.speed, analysis.complexity),
    };
  }

  private generateReasoning(provider: AIProvider, analysis: PromptAnalysis, taskType: TaskType): string {
    const reasons: string[] = [];

    if (provider === 'claude') {
      if (analysis.requiresCodeGeneration) {
        reasons.push('Superior code generation capabilities');
      }
      if (analysis.complexity === 'high') {
        reasons.push('Excellent at complex reasoning');
      }
      if (taskType === 'scaffold' || taskType === 'database') {
        reasons.push('Best for architectural design');
      }
    } else if (provider === 'openai') {
      if (analysis.requiresCreativity) {
        reasons.push('Strong creative capabilities');
      }
      if (analysis.complexity === 'medium') {
        reasons.push('Balanced performance for medium complexity');
      }
      reasons.push('Fast response times');
    } else if (provider === 'gemini') {
      if (analysis.estimatedTokens > 50000) {
        reasons.push('Massive context window (1M tokens)');
      }
      if (analysis.complexity === 'low') {
        reasons.push('Cost-effective for simpler tasks');
      }
      reasons.push('Excellent value for tokens');
    }

    return reasons.join('. ') || 'Best overall fit for this task';
  }

  private estimateTime(speed: 'fast' | 'medium' | 'slow', complexity: 'low' | 'medium' | 'high'): number {
    const baseTime = {
      fast: 2,
      medium: 4,
      slow: 8,
    }[speed];

    const complexityMultiplier = {
      low: 1,
      medium: 1.5,
      high: 2.5,
    }[complexity];

    return Math.ceil(baseTime * complexityMultiplier); // In seconds
  }

  /**
   * Generate with the selected model
   */
  async generate(prompt: string, taskType: TaskType, userPreference?: AIProvider): Promise<{
    response: string;
    provider: AIProvider;
    model: string;
    tokensUsed: number;
    cost: number;
  }> {
    const selection = this.selectModel(prompt, taskType, userPreference);
    const config = this.models.get(selection.provider)!;

    console.log('[Model Router] Selected provider:', selection.provider, 'Model:', selection.model);
    console.log('[Model Router] Reasoning:', selection.reasoning);

    if (!config.apiKey) {
      console.error('[Model Router] API key missing for:', selection.provider);
      throw new Error(`API key not configured for ${selection.provider}`);
    }

    console.log('[Model Router] API key present for', selection.provider, '- length:', config.apiKey.length);

    try {
      // Generate using the selected provider
      const result = await this.generateWithProvider(selection.provider, config, prompt);

      console.log('[Model Router] Generation successful! Tokens used:', result.tokensUsed);

      return {
        response: result.response,
        provider: selection.provider,
        model: selection.model,
        tokensUsed: result.tokensUsed,
        cost: result.tokensUsed * config.capabilities.costPerToken,
      };
    } catch (error: any) {
      console.error('[Model Router] Generation error:', error);
      console.error('[Model Router] Error message:', error.message);
      throw error;
    }
  }

  private async generateWithProvider(
    provider: AIProvider,
    config: AIModelConfig,
    prompt: string
  ): Promise<{ response: string; tokensUsed: number }> {
    switch (provider) {
      case 'claude':
        return this.generateWithClaude(config, prompt);
      case 'openai':
        return this.generateWithOpenAI(config, prompt);
      case 'gemini':
      case 'gemini-pro':
        return this.generateWithGemini(config, prompt);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private async generateWithClaude(
    config: AIModelConfig,
    prompt: string
  ): Promise<{ response: string; tokensUsed: number }> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      response: data.content[0].text,
      tokensUsed: data.usage.input_tokens + data.usage.output_tokens,
    };
  }

  private async generateWithOpenAI(
    config: AIModelConfig,
    prompt: string
  ): Promise<{ response: string; tokensUsed: number }> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      response: data.choices[0].message.content,
      tokensUsed: data.usage.total_tokens,
    };
  }

  private async generateWithGemini(
    config: AIModelConfig,
    prompt: string
  ): Promise<{ response: string; tokensUsed: number }> {
    console.log('[Gemini] Calling API with model:', config.model);
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Gemini] API error response:', errorText);
      throw new Error(`Gemini API error (${response.status}): ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[Gemini] API response received');
    
    const text = data.candidates[0].content.parts[0].text;
    
    // Gemini doesn't return token counts in the same way, estimate
    const tokensUsed = Math.ceil((prompt.length + text.length) / 4);

    return {
      response: text,
      tokensUsed,
    };
  }

  /**
   * Get model information for display to users
   */
  getModelInfo(provider: AIProvider): AIModelConfig | undefined {
    return this.models.get(provider);
  }

  /**
   * Get all available models
   */
  getAllModels(): AIModelConfig[] {
    return Array.from(this.models.values());
  }
}

// Singleton instance
export const modelRouter = new AIModelRouter();


