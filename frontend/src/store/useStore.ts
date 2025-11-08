import { create } from 'zustand';
import { Agent, Message } from '../types';
import { io, Socket } from 'socket.io-client';

interface StoreState {
  agents: Agent[];
  activeAgentId: string | null;
  messages: Record<string, Message[]>;
  isTyping: boolean;
  socket: Socket | null;

  setActiveAgent: (agentId: string | null) => void;
  sendMessage: (agentId: string, content: string) => void;
  initializeSocket: () => void;
  addMessage: (agentId: string, message: Message) => void;
  setTyping: (isTyping: boolean) => void;
}

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

export const useStore = create<StoreState>((set, get) => ({
  agents: [
    {
      id: 'ceo',
      name: 'Alex',
      role: 'CEO',
      description: 'Strategic planning and business decisions',
      position: [0, 1, -3],
      color: '#8B5CF6',
    },
    {
      id: 'cto',
      name: 'Jordan',
      role: 'CTO',
      description: 'Technical architecture and development',
      position: [-3, 1, 0],
      color: '#3B82F6',
    },
    {
      id: 'cfo',
      name: 'Morgan',
      role: 'CFO',
      description: 'Financial planning and analysis',
      position: [3, 1, 0],
      color: '#10B981',
    },
    {
      id: 'dev',
      name: 'Sam',
      role: 'Developer',
      description: 'Code implementation and debugging',
      position: [-3, 1, 3],
      color: '#F59E0B',
    },
    {
      id: 'marketing',
      name: 'Taylor',
      role: 'Marketing',
      description: 'Marketing strategy and campaigns',
      position: [3, 1, 3],
      color: '#EF4444',
    },
  ],
  activeAgentId: null,
  messages: {},
  isTyping: false,
  socket: null,

  setActiveAgent: (agentId) => set({ activeAgentId: agentId }),

  initializeSocket: () => {
    const socket = io(WS_URL);

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('agent-response', (data: { agentId: string; content: string }) => {
      const message: Message = {
        id: `${Date.now()}-${Math.random()}`,
        agentId: data.agentId,
        content: data.content,
        timestamp: Date.now(),
        sender: 'agent',
      };
      get().addMessage(data.agentId, message);
      get().setTyping(false);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    set({ socket });
  },

  sendMessage: (agentId, content) => {
    const { socket } = get();
    if (!socket) return;

    const userMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      agentId,
      content,
      timestamp: Date.now(),
      sender: 'user',
    };

    get().addMessage(agentId, userMessage);
    get().setTyping(true);

    socket.emit('user-message', { agentId, content });
  },

  addMessage: (agentId, message) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [agentId]: [...(state.messages[agentId] || []), message],
      },
    }));
  },

  setTyping: (isTyping) => set({ isTyping }),
}));
