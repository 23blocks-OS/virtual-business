export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  position: [number, number, number];
  color: string;
  avatar?: string;
}

export interface Message {
  id: string;
  agentId: string;
  content: string;
  timestamp: number;
  sender: 'user' | 'agent';
}

export interface ChatState {
  activeAgentId: string | null;
  messages: Record<string, Message[]>;
  isTyping: boolean;
}
