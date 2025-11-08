# Contributing Guide

## Development Setup

### Prerequisites
- Node.js >= 18
- npm >= 9
- Docker (for deployment)
- AWS CLI (for deployment)
- Terraform >= 1.0 (for infrastructure)

### Initial Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd virtual-business

# Install all dependencies
npm install

# Set up environment variables
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# Add your Anthropic API key to backend/.env
```

### Development Workflow

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # http://localhost:5173
npm run dev:backend   # http://localhost:3000
```

## Project Structure

```
virtual-business/
├── frontend/              # React + Three.js + R3F
│   ├── src/
│   │   ├── components/    # 3D and UI components
│   │   ├── store/         # Zustand state management
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
│
├── backend/               # Node.js + Express + Socket.io
│   ├── src/
│   │   ├── agents/        # AI agent configuration
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── Dockerfile         # Container definition
│
└── infrastructure/        # Terraform for AWS
    ├── modules/
    │   ├── networking/    # VPC, subnets, etc.
    │   ├── ecs/           # Container orchestration
    │   └── s3-cloudfront/ # Frontend hosting
    └── main.tf            # Root configuration

```

## Coding Standards

### TypeScript
- Use strict mode
- Prefer interfaces over types for objects
- Use meaningful variable names
- Add JSDoc comments for public APIs

### React
- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Avoid inline styles (use CSS modules or styled components)

### Backend
- Use async/await over promises
- Handle errors gracefully
- Log important events
- Validate input data

## Adding New Features

### Adding a New AI Agent

1. Edit `backend/src/agents/agentConfig.ts`:
```typescript
{
  id: 'new-agent',
  name: 'Agent Name',
  role: 'Role',
  description: 'What this agent does',
  systemPrompt: 'Detailed system prompt...',
}
```

2. Update `frontend/src/store/useStore.ts` with the same agent info

3. The agent will automatically appear in the 3D office

### Adding New 3D Objects

1. Create component in `frontend/src/components/`
2. Import and use in `VirtualOffice.tsx`
3. Follow Three.js best practices for performance

### Modifying Infrastructure

1. Edit Terraform files in `infrastructure/`
2. Test changes with `terraform plan`
3. Document any new variables in README

## Testing

### Frontend
```bash
cd frontend
npm run lint
npm run build  # Ensure it builds without errors
```

### Backend
```bash
cd backend
npm run lint
npm run build  # Ensure it compiles
```

### End-to-End Testing
1. Start both services
2. Open frontend in browser
3. Click on each agent and test conversations
4. Check browser console for errors
5. Check backend terminal for errors

## Git Workflow

1. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
3. Test thoroughly
4. Commit with clear messages
   ```bash
   git commit -m "Add: description of what you added"
   ```

5. Push to your branch
   ```bash
   git push origin feature/your-feature-name
   ```

## Deployment

See individual README files:
- [Frontend Deployment](frontend/README.md)
- [Backend Deployment](backend/README.md)
- [Infrastructure Deployment](infrastructure/README.md)

## Performance Optimization

### Frontend
- Use React.memo for expensive components
- Implement virtualization for long lists
- Optimize 3D models (low poly count)
- Use texture compression
- Lazy load components

### Backend
- Implement response caching
- Use connection pooling
- Rate limit API calls
- Monitor memory usage
- Scale horizontally with ECS

## Debugging Tips

### Frontend Issues
- Check browser console
- Use React DevTools
- Enable Three.js debug mode
- Check WebSocket connection in Network tab

### Backend Issues
- Check terminal output
- Use `console.log` strategically
- Check CloudWatch Logs (production)
- Test API endpoints with curl/Postman

### Infrastructure Issues
- Run `terraform plan` to check changes
- Check AWS Console for resource status
- Review CloudWatch Logs
- Verify security group rules

## Questions?

Open an issue or contact the maintainer.

## License

MIT
