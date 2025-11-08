# Virtual AI Office 🏢

A spatial computing experience with AI agent avatars - your virtual office where AI agents work alongside you.

## 🎯 Vision

Create an immersive 3D virtual office where AI agents are represented as avatars. Click on any agent to interact, see their responses on floating boards, and collaborate in a spatial environment. Optimized for Apple Vision Pro and web browsers.

## 📁 Monorepo Structure

```
virtual-business/
├── frontend/          # React + Three.js + R3F (3D virtual office)
├── backend/           # Node.js + Express + Socket.io (AI agents)
├── infrastructure/    # Terraform for AWS deployment
└── package.json       # Workspace configuration
```

## 🚀 Quick Start

> **📖 For detailed local development setup, see [DEVELOPMENT.md](DEVELOPMENT.md)** - Complete guide with requirements, installation, configuration, and troubleshooting.

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Anthropic API Key ([get one here](https://console.anthropic.com/))
- Terraform >= 1.0 (for AWS deployment only)
- AWS CLI configured (for AWS deployment only)

### Local Installation

```bash
# 1. Install all dependencies
npm install

# 2. Configure backend environment
cp backend/.env.example backend/.env
# Edit backend/.env and add your ANTHROPIC_API_KEY

# 3. Run both frontend and backend in development mode
npm run dev
```

### Development URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Backend WebSocket: ws://localhost:3000

## 🏗️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Three.js** - 3D rendering
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers
- **@react-three/xr** - WebXR for Vision Pro
- **Zustand** - State management
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Socket.io** - WebSocket server
- **Anthropic Claude API** - AI agent intelligence

### Infrastructure
- **Terraform** - Infrastructure as Code
- **AWS ECS** - Container orchestration
- **AWS ALB** - Load balancing
- **AWS ECR** - Container registry
- **AWS RDS** - Database (optional)
- **AWS S3** - Static file hosting
- **AWS CloudFront** - CDN

## 🎮 Features

### Phase 1 (Current)
- ✅ 3D virtual office environment
- ✅ Multiple AI agent avatars
- ✅ Click-to-interact functionality
- ✅ Floating chat boards
- ✅ Real-time AI responses via WebSocket
- ✅ WebXR support for Vision Pro

### Phase 2 (Planned)
- 🔄 Agent memory and context
- 🔄 Custom agent personalities
- 🔄 Agent-to-agent communication
- 🔄 Spatial audio
- 🔄 Hand tracking for Vision Pro
- 🔄 Multi-user collaboration

## 🏢 Virtual Office Layout

```
         [CEO Agent]
              |
    [CTO Agent]   [CFO Agent]
         |             |
  [Dev Agent]    [Marketing Agent]
```

## 🤖 AI Agents

Each agent has:
- Unique avatar and position in the 3D space
- Specific role and expertise
- Ability to call external APIs
- Persistent conversation history
- Floating board for displaying responses

## 📦 Deployment

### Quick Deployment with Scripts

We provide deployment scripts for easy setup:

```bash
# 1. Set up infrastructure
./scripts/setup-infrastructure.sh

# 2. Apply infrastructure (after reviewing terraform.tfvars)
cd infrastructure && terraform apply

# 3. Deploy backend
./scripts/deploy-backend.sh

# 4. Deploy frontend
./scripts/deploy-frontend.sh
```

### Manual AWS Deployment

```bash
# 1. Set up infrastructure
cd infrastructure
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your settings
terraform init
terraform plan
terraform apply

# 2. Build and push backend
cd ../backend
docker build -t <ECR_REPO>:latest .
docker push <ECR_REPO>:latest

# 3. Build and deploy frontend
cd ../frontend
npm run build
aws s3 sync dist/ s3://<S3_BUCKET>/
```

See [infrastructure/README.md](infrastructure/README.md) for detailed deployment instructions.

### Teardown

To destroy all AWS resources:

```bash
./scripts/teardown.sh
```

## 🔧 Configuration

### Frontend Environment Variables
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

### Backend Environment Variables
Create `backend/.env`:
```env
PORT=3000
ANTHROPIC_API_KEY=your_api_key_here
CORS_ORIGIN=http://localhost:5173
```

## 📚 Documentation

- **[Local Development Guide](DEVELOPMENT.md)** - Complete setup and troubleshooting
- [Frontend Documentation](frontend/README.md) - 3D components and React setup
- [Backend Documentation](backend/README.md) - API and AI agent configuration
- [Infrastructure Documentation](infrastructure/README.md) - AWS deployment
- [Contributing Guide](CONTRIBUTING.md) - Development workflow and standards

## 🛠️ Available Scripts

### Root Level
- `npm install` - Install all dependencies
- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only
- `npm run build` - Build all projects
- `npm run clean` - Clean all node_modules and build artifacts

### Deployment Scripts
- `./scripts/setup-infrastructure.sh` - Initialize Terraform
- `./scripts/deploy-backend.sh` - Deploy backend to AWS
- `./scripts/deploy-frontend.sh` - Deploy frontend to AWS
- `./scripts/teardown.sh` - Destroy all AWS resources

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines and best practices.

## 📝 License

MIT

## 🎨 Vision Pro Optimization

The application is optimized for Apple Vision Pro:
- WebXR immersive mode
- Spatial UI elements
- Hand gesture support
- Optimized 3D rendering
- Progressive enhancement (works on desktop too)

---

Built with ❤️ for the future of work
