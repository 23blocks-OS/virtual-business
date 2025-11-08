import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { agents } from './agents/agentConfig.js';
import { getAgentResponse, clearConversationHistory } from './agents/aiService.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all agents endpoint
app.get('/api/agents', (req, res) => {
  res.json(agents);
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle user messages
  socket.on('user-message', async (data: { agentId: string; content: string }) => {
    try {
      console.log(`Message for ${data.agentId}:`, data.content);

      // Get AI response
      const response = await getAgentResponse(data.agentId, data.content, socket.id);

      // Send response back to client
      socket.emit('agent-response', {
        agentId: data.agentId,
        content: response,
      });
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('agent-response', {
        agentId: data.agentId,
        content: 'Sorry, I encountered an error processing your message. Please try again.',
      });
    }
  });

  // Handle clearing conversation history
  socket.on('clear-history', (data: { agentId?: string }) => {
    clearConversationHistory(socket.id, data.agentId);
    socket.emit('history-cleared', { agentId: data.agentId });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Clean up conversation history for this session
    clearConversationHistory(socket.id);
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`
🚀 Virtual AI Office Backend Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Server running on: http://localhost:${PORT}
WebSocket ready on: ws://localhost:${PORT}
Environment: ${process.env.NODE_ENV || 'development'}

Available Agents:
${agents.map(a => `  • ${a.name} (${a.role})`).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});
