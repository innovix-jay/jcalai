/**
 * Client-side AI helper that calls the server-side API
 * This ensures API keys remain secure on the server
 */

import type { AIProvider, TaskType } from './model-router';

export interface AIGenerationResult {
  response: string;
  provider: AIProvider;
  model: string;
  tokensUsed: number;
  cost: number;
}

export interface AIGenerationError {
  error: string;
  details?: string;
}

/**
 * Generate AI response using the server-side API
 * @param prompt The prompt to send to the AI
 * @param taskType The type of task (e.g., 'general', 'code', 'component')
 * @param userPreference Optional: preferred AI provider ('claude', 'openai', 'gemini', 'gemini-pro', or 'auto')
 */
export async function generateAI(
  prompt: string,
  taskType: TaskType = 'general',
  userPreference?: AIProvider
): Promise<AIGenerationResult> {
  console.log('[Client AI] Calling /api/ai/generate with model:', userPreference || 'auto');
  
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        taskType,
        userPreference,
      }),
    });

    if (!response.ok) {
      const errorData: AIGenerationError = await response.json();
      console.error('[Client AI] API error:', errorData);
      throw new Error(errorData.error || 'Failed to generate AI response');
    }

    const data = await response.json();
    console.log('[Client AI] Success! Provider:', data.provider, 'Model:', data.model);
    
    return {
      response: data.response,
      provider: data.provider,
      model: data.model,
      tokensUsed: data.tokensUsed,
      cost: data.cost,
    };
  } catch (error: any) {
    console.error('[Client AI] Error:', error);
    throw error;
  }
}

/**
 * Test AI connection for a specific provider
 */
export async function testAIProvider(provider: AIProvider): Promise<{
  success: boolean;
  response?: string;
  error?: string;
}> {
  try {
    const result = await generateAI(
      'Hello! Please respond with a brief friendly greeting.',
      'general',
      provider
    );
    
    return {
      success: true,
      response: result.response,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

