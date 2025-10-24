import Anthropic from '@anthropic-ai/sdk';

interface FixResult {
  fixed: boolean;
  changes: Record<string, string>;
  explanation: string;
  confidence: number;
}

export class AICodeFixer {
  private anthropic = new Anthropic({ 
    apiKey: process.env.ANTHROPIC_API_KEY || '' 
  });

  async detectAndFixErrors(
    projectId: string,
    errorLogs: string[],
    files: Record<string, string>
  ): Promise<FixResult> {
    try {
      console.log('[AI Fixer] Analyzing errors...');

      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: `You are an expert debugger and code fixer. Analyze these errors and fix them.

ERRORS:
${errorLogs.join('\n\n')}

CODE FILES:
${JSON.stringify(files, null, 2)}

Analyze the errors, identify the root cause, and fix them. Return JSON ONLY (no markdown):
{
  "fixed": true/false,
  "changes": {
    "path/to/file.tsx": "fixed file content with complete code",
    ...
  },
  "explanation": "Clear explanation of what was broken and how you fixed it",
  "confidence": 0.0-1.0
}

RULES:
1. Only modify files that have errors
2. Preserve all existing functionality
3. Make minimal, surgical changes
4. Include the complete fixed file content in changes
5. If the error is unclear or you can't fix it confidently, set fixed: false

Respond with ONLY valid JSON.`
        }]
      });

      const firstBlock = response.content[0];
      const jsonText = (firstBlock.type === 'text' ? firstBlock.text : '')
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const result: FixResult = JSON.parse(jsonText);

      console.log(`[AI Fixer] Result: ${result.fixed ? 'Fixed' : 'Could not fix'} (confidence: ${result.confidence})`);

      return result;
    } catch (error: any) {
      console.error('[AI Fixer] Error:', error);
      return {
        fixed: false,
        changes: {},
        explanation: `Failed to analyze: ${error.message}`,
        confidence: 0
      };
    }
  }

  async autoFixOnError(
    projectId: string,
    error: {
      message: string;
      stack?: string;
      file?: string;
      line?: number;
    }
  ): Promise<FixResult> {
    const errorLog = [
      `Error: ${error.message}`,
      error.stack && `Stack: ${error.stack}`,
      error.file && `File: ${error.file}:${error.line}`
    ].filter(Boolean).join('\n');

    // TODO: Fetch actual project files
    const files = {
      'placeholder.tsx': '// File content here'
    };

    return this.detectAndFixErrors(projectId, [errorLog], files);
  }
}
