# Virtual Office Backend

Backend server for Virtual AI Office with AI agent intelligence powered by Anthropic's Claude.

## Tech Stack

- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Socket.io** - WebSocket server for real-time communication
- **Anthropic Claude API** - AI agent intelligence

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

## Environment Variables

Create a `.env` file:

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
ANTHROPIC_API_KEY=your_anthropic_api_key_here
NODE_ENV=development
```

### Getting an Anthropic API Key

1. Sign up at https://console.anthropic.com/
2. Navigate to API Keys section
3. Create a new API key
4. Add it to your `.env` file

## Features

- WebSocket server for real-time AI communication
- Multiple AI agents with unique personalities
- Conversation history management per agent
- Anthropic Claude integration
- CORS enabled for frontend
- Health check endpoint

## API Endpoints

### REST API

- `GET /health` - Health check
- `GET /api/agents` - Get all available agents

### WebSocket Events

**Client → Server:**
- `user-message` - Send a message to an agent
  ```json
  {
    "agentId": "ceo",
    "content": "What's our growth strategy?"
  }
  ```
- `clear-history` - Clear conversation history
  ```json
  {
    "agentId": "ceo"  // optional, clears all if omitted
  }
  ```

**Server → Client:**
- `agent-response` - Agent's AI-generated response
  ```json
  {
    "agentId": "ceo",
    "content": "Based on our current market position..."
  }
  ```
- `history-cleared` - Confirmation of history clearing

## AI Agents

Each agent has:
- Unique personality and expertise
- Custom system prompt
- Conversation memory
- Real-time response generation

### Available Agents

1. **Alex (CEO)** - Strategic planning and business decisions
2. **Jordan (CTO)** - Technical architecture and development
3. **Morgan (CFO)** - Financial planning and analysis
4. **Sam (Developer)** - Code implementation and debugging
5. **Taylor (Marketing)** - Marketing strategy and campaigns

## Project Structure

```
src/
├── agents/
│   ├── agentConfig.ts     # Agent definitions and prompts
│   └── aiService.ts       # Claude API integration
├── types/
│   └── index.ts           # TypeScript interfaces
└── index.ts               # Server entry point
```

## Development

The server automatically:
- Manages conversation history per user session
- Keeps last 10 messages for context
- Cleans up on client disconnect
- Handles errors gracefully

## Claude API Usage

The backend uses Claude 3.5 Sonnet for AI responses:
- Model: `claude-3-5-sonnet-20241022`
- Max tokens: 1024 per response
- Conversation context maintained per agent

## Error Handling

If the Claude API is unavailable or the API key is invalid, agents will return friendly fallback messages instead of crashing.

## Production Considerations

- Set `NODE_ENV=production`
- Use proper API key rotation
- Implement rate limiting for WebSocket
- Add authentication if needed
- Monitor API usage and costs
- Consider caching for frequently asked questions
