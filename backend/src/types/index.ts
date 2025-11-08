export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  systemPrompt: string;
  apiEndpoints?: string[];
}

export interface UserMessage {
  agentId: string;
  content: string;
}

export interface AgentResponse {
  agentId: string;
  content: string;
}

export interface ConversationContext {
  agentId: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}
