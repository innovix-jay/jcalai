import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Universal Agent Interface
export interface Agent {
  id: string;
  name: string;
  description: string;
  avatar: string;
  color: string;
  
  // Capabilities
  capabilities: AgentCapability[];
  
  // Configuration
  model: 'claude' | 'gpt' | 'gemini';
  systemPrompt: string;
  temperature: number;
  
  // Memory
  memory: AgentMemory;
  
  // Tools
  tools: AgentTool[];
  
  // State
  isActive: boolean;
  currentTask?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface AgentCapability {
  name: string;
  description: string;
  enabled: boolean;
  icon?: string;
}

export interface AgentMemory {
  shortTerm: Message[]; // Recent conversation
  longTerm: any[]; // Vector store for long-term memory
  skills: LearnedSkill[]; // Skills agent has learned
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AgentTool {
  name: string;
  description: string;
  execute: (params: any) => Promise<any>;
}

export interface LearnedSkill {
  name: string;
  description: string;
  learnedFrom: string;
  usageCount: number;
  learnedAt: Date;
}

export interface AgentResponse {
  message: string;
  toolsUsed: string[];
  newSkill?: LearnedSkill;
  thinkingProcess?: string;
}

// Agent Runtime
export class AgentRuntime {
  agent: Agent;
  private ai: any;
  
  constructor(agent: Agent) {
    this.agent = agent;
    this.initializeAI();
  }
  
  private initializeAI() {
    switch (this.agent.model) {
      case 'claude':
        this.ai = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        break;
      case 'gpt':
        this.ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        break;
      case 'gemini':
        this.ai = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY!);
        break;
    }
  }
  
  async execute(userMessage: string, context?: any): Promise<AgentResponse> {
    // Add to short-term memory
    this.agent.memory.shortTerm.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });
    
    // Keep only last 20 messages in short-term memory
    if (this.agent.memory.shortTerm.length > 20) {
      this.agent.memory.shortTerm = this.agent.memory.shortTerm.slice(-20);
    }
    
    // Retrieve relevant long-term memories
    const relevantMemories = await this.retrieveMemories(userMessage);
    
    // Determine which tools to use
    const toolsToUse = await this.selectTools(userMessage);
    
    // Execute with AI
    const response = await this.executeWithAI(
      userMessage,
      relevantMemories,
      toolsToUse,
      context
    );
    
    // Store in memory
    this.agent.memory.shortTerm.push({
      role: 'assistant',
      content: response.message,
      timestamp: new Date()
    });
    
    // Update skills if agent learned something
    if (response.newSkill) {
      this.agent.memory.skills.push(response.newSkill);
    }
    
    return response;
  }
  
  private async executeWithAI(
    message: string,
    memories: any[],
    tools: AgentTool[],
    context?: any
  ): Promise<AgentResponse> {
    const systemPrompt = this.buildSystemPrompt(memories, context);
    
    if (this.agent.model === 'claude') {
      const response = await this.ai.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4000,
        temperature: this.agent.temperature,
        system: systemPrompt,
        messages: this.agent.memory.shortTerm.map(m => ({
          role: m.role,
          content: m.content
        })),
        tools: tools.map(t => ({
          name: t.name,
          description: t.description,
          input_schema: { type: 'object', properties: {} }
        }))
      });
      
      return this.processClaudeResponse(response);
    } else if (this.agent.model === 'gpt') {
      const messages: any[] = [
        { role: 'system', content: systemPrompt },
        ...this.agent.memory.shortTerm.map(m => ({
          role: m.role,
          content: m.content
        }))
      ];
      
      const response = await this.ai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        temperature: this.agent.temperature,
        max_tokens: 4000
      });
      
      return {
        message: response.choices[0].message.content || '',
        toolsUsed: [],
        newSkill: undefined
      };
    } else if (this.agent.model === 'gemini') {
      const model = this.ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      
      const chat = model.startChat({
        history: this.agent.memory.shortTerm.slice(0, -1).map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })),
        generationConfig: {
          temperature: this.agent.temperature,
          maxOutputTokens: 4000
        }
      });
      
      const result = await chat.sendMessage(message);
      
      return {
        message: result.response.text(),
        toolsUsed: [],
        newSkill: undefined
      };
    }
    
    throw new Error(`Unsupported model: ${this.agent.model}`);
  }
  
  private buildSystemPrompt(memories: any[], context?: any): string {
    return `${this.agent.systemPrompt}

AGENT IDENTITY:
- Name: ${this.agent.name}
- Role: ${this.agent.description}

RELEVANT MEMORIES:
${memories.length > 0 ? memories.map(m => `- ${m.content}`).join('\n') : 'No relevant memories'}

LEARNED SKILLS:
${this.agent.memory.skills.length > 0 
  ? this.agent.memory.skills.map(s => `- ${s.name}: ${s.description}`).join('\n')
  : 'No learned skills yet'}

CAPABILITIES:
${this.agent.capabilities.filter(c => c.enabled).map(c => `- ${c.name}: ${c.description}`).join('\n')}

${context ? `CURRENT CONTEXT:\n${JSON.stringify(context, null, 2)}` : ''}

You are an autonomous agent. Think step-by-step, use tools when needed, and learn from interactions.
Always be helpful, clear, and actionable in your responses.`;
  }
  
  private async retrieveMemories(query: string): Promise<any[]> {
    // Vector similarity search in long-term memory
    // TODO: Implement with vector DB (Pinecone, Weaviate, etc.)
    return [];
  }
  
  private async selectTools(message: string): Promise<AgentTool[]> {
    // AI determines which tools are relevant
    // For now, return all available tools
    return this.agent.tools;
  }
  
  private processClaudeResponse(response: any): AgentResponse {
    // Process AI response, handle tool calls, extract learned skills
    const firstBlock = response.content[0];
    const message = firstBlock.type === 'text' ? firstBlock.text : '';
    
    return {
      message,
      toolsUsed: [],
      newSkill: undefined
    };
  }
}

// Agent Factory for creating new agents
export class AgentFactory {
  static createAgent(params: Partial<Agent>): Agent {
    return {
      id: params.id || generateId(),
      name: params.name || 'Unnamed Agent',
      description: params.description || '',
      avatar: params.avatar || '🤖',
      color: params.color || '#6366f1',
      capabilities: params.capabilities || [],
      model: params.model || 'gemini',
      systemPrompt: params.systemPrompt || 'You are a helpful AI assistant.',
      temperature: params.temperature || 0.7,
      memory: params.memory || {
        shortTerm: [],
        longTerm: [],
        skills: []
      },
      tools: params.tools || [],
      isActive: params.isActive || false,
      currentTask: params.currentTask,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: params.userId || ''
    };
  }
}

function generateId(): string {
  return `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

