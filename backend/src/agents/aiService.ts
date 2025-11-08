import Anthropic from '@anthropic-ai/sdk';
import { getAgent } from './agentConfig.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Store conversation history per agent per session
const conversationHistory = new Map<string, Array<{ role: 'user' | 'assistant'; content: string }>>();

export async function getAgentResponse(
  agentId: string,
  userMessage: string,
  sessionId: string = 'default'
): Promise<string> {
  const agent = getAgent(agentId);

  if (!agent) {
    throw new Error(`Agent ${agentId} not found`);
  }

  // Get or create conversation history for this session
  const historyKey = `${sessionId}-${agentId}`;
  let history = conversationHistory.get(historyKey) || [];

  // Add user message to history
  history.push({
    role: 'user',
    content: userMessage,
  });

  try {
    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: agent.systemPrompt,
      messages: history.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : 'I apologize, but I could not generate a response.';

    // Add assistant response to history
    history.push({
      role: 'assistant',
      content: assistantMessage,
    });

    // Keep only last 10 messages to manage token usage
    if (history.length > 10) {
      history = history.slice(-10);
    }

    // Update conversation history
    conversationHistory.set(historyKey, history);

    return assistantMessage;
  } catch (error) {
    console.error('Error calling Claude API:', error);

    // Fallback response if API fails
    return `Hello! I'm ${agent.name}, your ${agent.role}. I'm currently experiencing technical difficulties connecting to my AI brain. Please try again in a moment.`;
  }
}

export function clearConversationHistory(sessionId: string, agentId?: string) {
  if (agentId) {
    conversationHistory.delete(`${sessionId}-${agentId}`);
  } else {
    // Clear all conversations for this session
    const keys = Array.from(conversationHistory.keys());
    keys.forEach(key => {
      if (key.startsWith(`${sessionId}-`)) {
        conversationHistory.delete(key);
      }
    });
  }
}
