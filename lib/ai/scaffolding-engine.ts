/**
 * AI Scaffolding Engine - Generates complete project structures from prompts
 */

import { modelRouter, TaskType } from './model-router';

export interface ProjectScaffold {
  projectInfo: {
    name: string;
    description: string;
    appType: 'web' | 'mobile' | 'automation' | 'ai_tool' | 'api' | 'dashboard' | 'ecommerce' | 'saas' | 'custom';
  };
  config: {
    framework: string;
    styling: string;
    database: string;
    auth: boolean;
    api: boolean;
    features: string[];
  };
  pages: Array<{
    name: string;
    slug: string;
    path: string;
    isProtected: boolean;
    structure: any;
  }>;
  components: Array<{
    name: string;
    type: string;
    structure: any;
  }>;
  databaseSchema?: {
    tables: Array<{
      name: string;
      columns: Array<{
        name: string;
        type: string;
        nullable: boolean;
        unique: boolean;
      }>;
      relationships: Array<{
        type: 'one-to-one' | 'one-to-many' | 'many-to-many';
        table: string;
        foreignKey: string;
      }>;
    }>;
  };
  apiEndpoints?: Array<{
    name: string;
    path: string;
    method: string;
    description: string;
  }>;
  integrations?: Array<{
    service: string;
    purpose: string;
  }>;
}

export class ScaffoldingEngine {
  /**
   * Generate a complete project scaffold from a natural language prompt
   */
  async generateScaffold(prompt: string, userModel?: 'claude' | 'openai' | 'gemini' | 'auto'): Promise<ProjectScaffold> {
    // Create a detailed prompt for the AI
    const scaffoldPrompt = this.buildScaffoldPrompt(prompt);

    // Generate using the model router
    const result = await modelRouter.generate(scaffoldPrompt, 'scaffold', userModel);

    // Parse the AI response into a structured scaffold
    const scaffold = this.parseScaffoldResponse(result.response);

    return scaffold;
  }

  private buildScaffoldPrompt(userPrompt: string): string {
    return `You are a senior software architect. Analyze the following app idea and generate a complete project structure.

User's App Idea:
${userPrompt}

Generate a comprehensive JSON response with the following structure:
{
  "projectInfo": {
    "name": "Short project name (2-3 words, kebab-case)",
    "description": "Detailed description of the app",
    "appType": "web|mobile|automation|ai_tool|api|dashboard|ecommerce|saas|custom"
  },
  "config": {
    "framework": "nextjs|react|vue|angular",
    "styling": "tailwindcss|styled-components|css-modules",
    "database": "supabase|mongodb|mysql|postgresql",
    "auth": true|false,
    "api": true|false,
    "features": ["list", "of", "key", "features"]
  },
  "pages": [
    {
      "name": "Home",
      "slug": "home",
      "path": "/",
      "isProtected": false,
      "structure": {
        "sections": ["hero", "features", "cta"],
        "description": "Landing page with hero section and feature showcase"
      }
    }
  ],
  "components": [
    {
      "name": "ComponentName",
      "type": "layout|form|data_display|navigation",
      "structure": {
        "elements": ["element1", "element2"],
        "props": ["prop1", "prop2"],
        "description": "Component purpose"
      }
    }
  ],
  "databaseSchema": {
    "tables": [
      {
        "name": "users",
        "columns": [
          { "name": "id", "type": "uuid", "nullable": false, "unique": true },
          { "name": "email", "type": "text", "nullable": false, "unique": true }
        ],
        "relationships": []
      }
    ]
  },
  "apiEndpoints": [
    {
      "name": "Get Users",
      "path": "/api/users",
      "method": "GET",
      "description": "Retrieve all users"
    }
  ],
  "integrations": [
    {
      "service": "stripe",
      "purpose": "Payment processing"
    }
  ]
}

Be comprehensive and thoughtful. Include all necessary pages, components, database tables, and API endpoints needed for a complete, production-ready application.

Return ONLY valid JSON, no additional text.`;
  }

  private parseScaffoldResponse(response: string): ProjectScaffold {
    try {
      // Extract JSON from the response (in case AI adds extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const scaffold = JSON.parse(jsonMatch[0]);

      // Validate and set defaults
      return {
        projectInfo: {
          name: scaffold.projectInfo?.name || 'new-project',
          description: scaffold.projectInfo?.description || '',
          appType: scaffold.projectInfo?.appType || 'web',
        },
        config: {
          framework: scaffold.config?.framework || 'nextjs',
          styling: scaffold.config?.styling || 'tailwindcss',
          database: scaffold.config?.database || 'supabase',
          auth: scaffold.config?.auth !== false,
          api: scaffold.config?.api !== false,
          features: scaffold.config?.features || [],
        },
        pages: scaffold.pages || this.getDefaultPages(),
        components: scaffold.components || [],
        databaseSchema: scaffold.databaseSchema,
        apiEndpoints: scaffold.apiEndpoints,
        integrations: scaffold.integrations,
      };
    } catch (error) {
      console.error('Error parsing scaffold response:', error);
      // Return a basic scaffold if parsing fails
      return this.getBasicScaffold();
    }
  }

  private getDefaultPages() {
    return [
      {
        name: 'Home',
        slug: 'home',
        path: '/',
        isProtected: false,
        structure: {
          sections: ['hero', 'features'],
          description: 'Landing page',
        },
      },
      {
        name: 'Dashboard',
        slug: 'dashboard',
        path: '/dashboard',
        isProtected: true,
        structure: {
          sections: ['sidebar', 'main-content'],
          description: 'User dashboard',
        },
      },
    ];
  }

  private getBasicScaffold(): ProjectScaffold {
    return {
      projectInfo: {
        name: 'new-project',
        description: 'A new application',
        appType: 'web',
      },
      config: {
        framework: 'nextjs',
        styling: 'tailwindcss',
        database: 'supabase',
        auth: true,
        api: true,
        features: [],
      },
      pages: this.getDefaultPages(),
      components: [],
    };
  }

  /**
   * Generate a single page structure
   */
  async generatePage(
    pageName: string,
    pageDescription: string,
    projectContext?: string
  ): Promise<any> {
    const prompt = `Generate a detailed page structure for a page called "${pageName}".
    
Description: ${pageDescription}
${projectContext ? `Project Context: ${projectContext}` : ''}

Return a JSON object with the following structure:
{
  "name": "${pageName}",
  "slug": "url-slug",
  "path": "/path",
  "isProtected": false,
  "structure": {
    "ROOT": {
      "type": "Container",
      "nodes": ["node1", "node2"],
      "props": {
        "className": "min-h-screen"
      },
      "children": [
        {
          "type": "Hero",
          "props": {
            "title": "Page title",
            "subtitle": "Page subtitle"
          }
        }
      ]
    }
  },
  "title": "Page Title",
  "description": "Meta description"
}

Return ONLY valid JSON.`;

    const result = await modelRouter.generate(prompt, 'page');

    try {
      const jsonMatch = result.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing page response:', error);
    }

    // Return default page structure
    return {
      name: pageName,
      slug: pageName.toLowerCase().replace(/\s+/g, '-'),
      path: `/${pageName.toLowerCase().replace(/\s+/g, '-')}`,
      isProtected: false,
      structure: {
        ROOT: {
          type: 'Container',
          nodes: [],
          props: {},
        },
      },
    };
  }

  /**
   * Generate a component structure
   */
  async generateComponent(
    componentName: string,
    componentDescription: string,
    componentType: string
  ): Promise<any> {
    const prompt = `Generate a detailed component structure for "${componentName}".
    
Type: ${componentType}
Description: ${componentDescription}

Return a JSON object with the component structure compatible with Craft.js:
{
  "name": "${componentName}",
  "type": "${componentType}",
  "structure": {
    "type": "div",
    "props": {
      "className": "component-wrapper"
    },
    "children": []
  },
  "propsSchema": {
    "title": { "type": "string", "default": "" },
    "description": { "type": "string", "default": "" }
  },
  "defaultProps": {}
}

Return ONLY valid JSON.`;

    const result = await modelRouter.generate(prompt, 'component');

    try {
      const jsonMatch = result.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing component response:', error);
    }

    return {
      name: componentName,
      type: componentType,
      structure: {},
    };
  }

  /**
   * Generate database schema
   */
  async generateDatabaseSchema(
    schemaDescription: string,
    projectContext?: string
  ): Promise<any> {
    const prompt = `Generate a database schema for the following requirements:
    
${schemaDescription}
${projectContext ? `\nProject Context: ${projectContext}` : ''}

Return a JSON object with tables, columns, and relationships:
{
  "tables": [
    {
      "name": "users",
      "columns": [
        { "name": "id", "type": "uuid", "nullable": false, "unique": true },
        { "name": "email", "type": "text", "nullable": false, "unique": true },
        { "name": "created_at", "type": "timestamp", "nullable": false, "unique": false }
      ],
      "relationships": [
        {
          "type": "one-to-many",
          "table": "posts",
          "foreignKey": "user_id"
        }
      ]
    }
  ]
}

Include all necessary tables with proper relationships. Return ONLY valid JSON.`;

    const result = await modelRouter.generate(prompt, 'database');

    try {
      const jsonMatch = result.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing database schema:', error);
    }

    return { tables: [] };
  }

  /**
   * Generate API endpoints
   */
  async generateAPIEndpoints(
    apiDescription: string,
    databaseSchema?: any
  ): Promise<any[]> {
    const schemaContext = databaseSchema
      ? `\nDatabase Tables: ${databaseSchema.tables.map((t: any) => t.name).join(', ')}`
      : '';

    const prompt = `Generate RESTful API endpoints for:
    
${apiDescription}${schemaContext}

Return a JSON array of endpoint definitions:
[
  {
    "name": "List Users",
    "path": "/api/users",
    "method": "GET",
    "description": "Retrieve all users",
    "auth": true,
    "requestSchema": {},
    "responseSchema": {
      "type": "array",
      "items": { "type": "object" }
    }
  }
]

Include all CRUD operations and necessary endpoints. Return ONLY valid JSON.`;

    const result = await modelRouter.generate(prompt, 'api');

    try {
      const jsonMatch = result.response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing API endpoints:', error);
    }

    return [];
  }
}

// Singleton instance
export const scaffoldingEngine = new ScaffoldingEngine();


