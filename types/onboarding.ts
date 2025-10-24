// AI Project Onboarding Types

export type ConversationStage = 
  | 'GREETING' 
  | 'GATHERING_REQUIREMENTS' 
  | 'CONFIRMING_PLAN' 
  | 'BUILDING' 
  | 'COMPLETED';

export interface ProjectRequirements {
  mainPurpose?: string;
  targetUsers?: string;
  coreFeatures?: string[];
  designPreferences?: string;
  additionalNotes?: string;
  techStack?: {
    database?: boolean;
    authentication?: boolean;
    payments?: boolean;
    realtime?: boolean;
    api?: boolean;
  };
}

export interface ProjectPlan {
  projectName: string;
  projectType: string;
  targetUsers: string;
  coreFeatures: string[];
  pages: PagePlan[];
  techStack: TechStackPlan;
  estimatedTime?: string;
}

export interface PagePlan {
  name: string;
  slug: string;
  purpose: string;
  components: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface TechStackPlan {
  database: boolean;
  databaseType?: string;
  authentication: boolean;
  authMethods?: string[];
  payments?: boolean;
  paymentProvider?: string;
  realtime?: boolean;
  apis?: string[];
}

export interface ConversationMessage {
  id: string;
  role: 'ai' | 'user' | 'system' | 'error';
  content: string;
  timestamp: Date;
  metadata?: {
    stage?: ConversationStage;
    requirementsGathered?: Partial<ProjectRequirements>;
    suggestedActions?: string[];
  };
}

export interface ConversationContext {
  projectId: string;
  projectName: string;
  initialPrompt: string;
  stage: ConversationStage;
  messages: ConversationMessage[];
  requirements: ProjectRequirements;
  plan?: ProjectPlan;
  conversationStartedAt?: Date;
  lastUpdatedAt?: Date;
}

export interface AIResponse {
  message: string;
  stage: ConversationStage;
  suggestedActions?: string[];
  requirementsUpdate?: Partial<ProjectRequirements>;
  planReady?: boolean;
  plan?: ProjectPlan;
}

export interface OnboardingState {
  isActive: boolean;
  context: ConversationContext | null;
  isProcessing: boolean;
  error: string | null;
}

