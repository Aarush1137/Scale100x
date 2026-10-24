export type Stage = 'New' | 'Contacted' | 'Qualified' | 'Consultation' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
export type Priority = 'Low' | 'Medium' | 'High';
export type LeadSource = 'Meta Ads' | 'WhatsApp' | 'Website' | 'Referral' | 'LinkedIn' | 'Cold Outreach';
export type ConversationStatus = 'AI Active' | 'Human Active' | 'Escalated' | 'Resolved';
export type AgentStatus = 'active' | 'paused' | 'inactive';
export type AssetStatus = 'draft' | 'review' | 'approved' | 'sent';
export type AssetType = 'Pitch Deck' | 'Sales Brochure' | 'Ad Creative' | 'WhatsApp Script';
export type WorkflowStatus = 'running' | 'paused' | 'error';

export interface Brand {
  id: string;
  name: string;
  industry: string;
  description: string;
  hq: string;
  outlets: number;
  targetOutlets: number;
  timeline: string;
  monthlyRevenue: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  readinessScore: number;
  status: 'draft' | 'onboarded' | 'active';
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  budget: number;
  stage: Stage;
  source: LeadSource;
  priority: Priority;
  intentScore: number;
  brandId: string;
  ownerId: string;
  notes: string;
  followUpDate: string | null;
  conversationId: string | null;
  tasks: Task[];
  activities: ActivityEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
}

export interface ActivityEvent {
  id: string;
  type: 'stage_change' | 'note' | 'call' | 'email' | 'message' | 'task' | 'human_takeover' | 'ai_resume' | 'created';
  description: string;
  timestamp: string;
  userId?: string;
}

export interface Conversation {
  id: string;
  leadId: string;
  leadName: string;
  phone: string;
  status: ConversationStatus;
  intentScore: number;
  intentLabel: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  escalationReason: string | null;
  humanTakeoverAt: string | null;
  assignedTo: string | null;
  internalNotes: string;
  qualification: {
    city: string;
    budget: string;
    experience: string;
    timeline: string;
    intentScore: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  direction: 'inbound' | 'outbound';
  sender: 'lead' | 'ai' | 'human';
  content: string;
  intentLabel?: string;
  confidence?: number;
  timestamp: string;
}

export interface CollateralAsset {
  id: string;
  name: string;
  type: AssetType;
  brandId: string;
  status: AssetStatus;
  content: string;
  targetAudience: string;
  campaignObjective: string;
  language: string;
  tone: string;
  versions: AssetVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface AssetVersion {
  id: string;
  content: string;
  createdAt: string;
  label: string;
}

export interface AuditEvent {
  id: string;
  type: string;
  description: string;
  entityType: string;
  entityId: string;
  userId: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  type: 'meta_ads' | 'whatsapp' | 'voice' | 'email';
  status: AgentStatus;
  purpose: string;
  conversationCount: number;
  qualificationThreshold: number;
  escalationKeywords: string[];
  responseDelay: number;
  lastActivity: string;
  config: Record<string, unknown>;
}

export interface Workflow {
  id: string;
  name: string;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  runsCount: number;
  leadsProcessed: number;
  lastRunAt: string | null;
  createdAt: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'trigger' | 'action' | 'condition' | 'human_checkpoint';
  status: 'idle' | 'running' | 'success' | 'error';
  description: string;
  dataPassed: string[];
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: 'success' | 'running' | 'error' | 'partial';
  triggeredBy: string;
  leadId: string | null;
  leadName: string | null;
  steps: { stepId: string; status: string; timestamp: string }[];
  startedAt: string;
  completedAt: string | null;
}

export interface OnboardingSession {
  id: string;
  brandId: string | null;
  currentStep: number;
  data: Record<string, unknown>;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialScenario {
  id: string;
  brandId: string;
  name: string;
  monthlyRevenue: number;
  initialInvestment: number;
  cogsPercent: number;
  employeeCosts: number;
  rent: number;
  utilities: number;
  marketingPercent: number;
  royaltyPercent: number;
  annualGrowthRate: number;
  createdAt: string;
}

export interface AppData {
  brands: Brand[];
  leads: Lead[];
  conversations: Conversation[];
  messages: Message[];
  assets: CollateralAsset[];
  events: AuditEvent[];
  agents: AgentConfig[];
  workflows: Workflow[];
  workflowRuns: WorkflowRun[];
  onboardingSessions: OnboardingSession[];
  financialScenarios: FinancialScenario[];
}
