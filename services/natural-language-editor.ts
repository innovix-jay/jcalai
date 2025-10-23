import Anthropic from '@anthropic-ai/sdk';

interface EditIntent {
  action: 'modify' | 'add' | 'remove' | 'rearrange';
  target: {
    type: 'component' | 'style' | 'content' | 'layout';
    selector: string;
    description: string;
  };
  changes: Record<string, any>;
  confidence: number;
}

export class NaturalLanguageEditor {
  private anthropic = new Anthropic({ 
    apiKey: process.env.ANTHROPIC_API_KEY || '' 
  });

  async parseEditCommand(
    command: string,
    projectContext: {
      currentPage: string;
      components: any[];
      fileStructure: any;
    }
  ): Promise<EditIntent> {
    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `You are an expert code editor AI. Parse this natural language editing command and determine the exact code changes needed.

PROJECT CONTEXT:
Current Page: ${projectContext.currentPage}
Components: ${JSON.stringify(projectContext.components, null, 2)}

USER COMMAND: "${command}"

Analyze the command and respond with JSON ONLY (no markdown, no explanation):
{
  "action": "modify" | "add" | "remove" | "rearrange",
  "target": {
    "type": "component" | "style" | "content" | "layout",
    "selector": "CSS selector or component name",
    "description": "Human-readable description"
  },
  "changes": {
    // Specific changes as key-value pairs
  },
  "confidence": 0.0-1.0
}

EXAMPLES:
"make the header sticky" → { "action": "modify", "target": { "type": "style", "selector": "header", "description": "main header" }, "changes": { "position": "sticky", "top": "0", "z-index": "50" }, "confidence": 0.95 }

"change button color to blue" → { "action": "modify", "target": { "type": "style", "selector": "button", "description": "primary button" }, "changes": { "background-color": "#3b82f6" }, "confidence": 0.9 }

Respond with ONLY valid JSON.`
      }]
    });

    const jsonText = response.content[0].text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(jsonText);
  }

  async applyEdit(
    intent: EditIntent,
    projectId: string,
    files: Record<string, string>
  ): Promise<{ updatedFiles: Record<string, string>; description: string }> {
    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `You are an expert code editor. Apply this edit to the code files.

EDIT INTENT:
${JSON.stringify(intent, null, 2)}

CURRENT FILES:
${JSON.stringify(files, null, 2)}

Generate the updated code files with the changes applied. Return JSON ONLY:
{
  "updatedFiles": {
    "path/to/file.tsx": "updated file content",
    ...
  },
  "description": "Human-readable description of what was changed"
}

Make minimal, surgical changes. Only modify what's necessary. Preserve all existing functionality.`
      }]
    });

    const result = JSON.parse(response.content[0].text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    return result;
  }
}
