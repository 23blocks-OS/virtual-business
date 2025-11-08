# Local Development Guide

This guide will help you set up and run the Virtual AI Office project on your local machine for development.

## Table of Contents

- [System Requirements](#system-requirements)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing Your Setup](#testing-your-setup)
- [Troubleshooting](#troubleshooting)
- [Tips and Best Practices](#tips-and-best-practices)

---

## System Requirements

### Minimum Requirements
- **OS:** macOS, Linux, or Windows 10/11
- **RAM:** 4GB minimum, 8GB recommended
- **Disk Space:** 2GB free space
- **Network:** Internet connection for npm packages and API calls

### Recommended Setup
- **OS:** macOS or Linux (Windows with WSL2)
- **RAM:** 16GB for comfortable development
- **CPU:** Multi-core processor
- **Browser:** Latest Chrome, Firefox, Safari, or Edge

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

### 1. Node.js and npm

**Required Version:**
- Node.js >= 18.0.0
- npm >= 9.0.0

**Installation:**

**macOS (using Homebrew):**
```bash
brew install node@18
```

**Linux (using nvm - recommended):**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js 18
nvm install 18
nvm use 18
```

**Windows:**
Download from [nodejs.org](https://nodejs.org/) or use [nvm-windows](https://github.com/coreybutler/nvm-windows)

**Verify Installation:**
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

### 2. Git

**Installation:**

**macOS:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt-get install git  # Debian/Ubuntu
sudo yum install git      # CentOS/RHEL
```

**Windows:**
Download from [git-scm.com](https://git-scm.com/)

**Verify Installation:**
```bash
git --version
```

### 3. Anthropic API Key

The AI agents use Anthropic's Claude API. You'll need an API key.

**Getting Your API Key:**

1. Visit [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **Create Key**
5. Copy your key (starts with `sk-ant-`)

**Pricing:**
- Free tier available with limited credits
- Pay-as-you-go pricing for production use
- Check [anthropic.com/pricing](https://www.anthropic.com/pricing) for current rates

**Important:** Keep your API key secure and never commit it to version control!

### 4. Code Editor (Recommended)

**Visual Studio Code** (recommended):
- Download from [code.visualstudio.com](https://code.visualstudio.com/)
- Install recommended extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - GitLens

---

## Installation

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd virtual-business
```

If you're working from a specific branch:
```bash
git checkout <branch-name>
```

### Step 2: Install Dependencies

The project uses npm workspaces, so one command installs everything:

```bash
npm install
```

This will install dependencies for:
- Root workspace
- Frontend workspace (`frontend/`)
- Backend workspace (`backend/`)

**Expected Output:**
```
added XXX packages in Xs

# You should see installations for:
# - frontend dependencies (React, Three.js, etc.)
# - backend dependencies (Express, Socket.io, etc.)
```

**If Installation Fails:**
```bash
# Clean everything and try again
npm run clean
rm -rf node_modules package-lock.json
npm install
```

### Step 3: Verify Installation

```bash
# Check workspace setup
npm ls --workspaces

# You should see both frontend and backend listed
```

---

## Configuration

### Backend Configuration

#### 1. Create Environment File

```bash
cd backend
cp .env.example .env
```

#### 2. Edit `.env` File

Open `backend/.env` in your editor and configure:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration (must match your frontend URL)
CORS_ORIGIN=http://localhost:5173

# Anthropic API Key (REQUIRED)
ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
```

**Configuration Details:**

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Backend server port | No | 3000 |
| `NODE_ENV` | Environment mode | No | development |
| `CORS_ORIGIN` | Allowed frontend origin | Yes | http://localhost:5173 |
| `ANTHROPIC_API_KEY` | Your Claude API key | Yes | None |

**Important Notes:**
- Replace `sk-ant-your-actual-api-key-here` with your real API key
- If you change `PORT`, update frontend configuration too
- Never commit `.env` to git (it's in `.gitignore`)

### Frontend Configuration

The frontend environment is already configured by default, but you can customize it:

#### Default Configuration (already created)

`frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

#### Custom Configuration (optional)

If you changed the backend port or need custom settings:

```bash
cd frontend
# Edit .env if needed
```

**Configuration Details:**

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend HTTP API URL | http://localhost:3000 |
| `VITE_WS_URL` | Backend WebSocket URL | ws://localhost:3000 |

**Port Conflicts?** If port 3000 or 5173 is already in use:

```bash
# Backend (backend/.env)
PORT=3001

# Frontend (frontend/.env)
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

---

## Running Locally

### Option 1: Run Everything Together (Recommended)

From the **root directory**:

```bash
npm run dev
```

This starts:
- **Frontend** on http://localhost:5173
- **Backend** on http://localhost:3000

**Expected Output:**
```
> virtual-business@1.0.0 dev
> concurrently "npm run dev:frontend" "npm run dev:backend"

[0]
[0] > virtual-office-frontend@1.0.0 dev
[0] > vite
[0]
[1] > virtual-office-backend@1.0.0 dev
[1] > tsx watch src/index.ts
[1]
[1] 🚀 Virtual AI Office Backend Server
[1] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1] Server running on: http://localhost:3000
[1] WebSocket ready on: ws://localhost:3000
[1] Environment: development
[1]
[1] Available Agents:
[1]   • Alex (CEO)
[1]   • Jordan (CTO)
[1]   • Morgan (CFO)
[1]   • Sam (Developer)
[1]   • Taylor (Marketing)
[1] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[0]
[0]   VITE v5.1.0  ready in XXX ms
[0]
[0]   ➜  Local:   http://localhost:5173/
[0]   ➜  Network: use --host to expose
```

### Option 2: Run Services Separately

Useful for debugging individual services.

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 3: Run Individual Commands

**Backend only:**
```bash
npm run dev:backend
```

**Frontend only:**
```bash
npm run dev:frontend
```

### Stopping the Servers

Press `Ctrl+C` in the terminal where the servers are running.

---

## Project Structure

Understanding the project structure helps with development:

```
virtual-business/
│
├── frontend/                      # React + Three.js Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── VirtualOffice.tsx # Main 3D scene component
│   │   │   ├── Room.tsx          # 3D room geometry
│   │   │   ├── AgentAvatar.tsx   # Individual agent 3D avatars
│   │   │   ├── ChatBoard.tsx     # 2D chat UI overlay
│   │   │   └── ChatBoard.css     # Chat styles
│   │   ├── store/
│   │   │   └── useStore.ts       # Zustand global state
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript interfaces
│   │   ├── App.tsx               # Root React component
│   │   ├── App.css               # Global styles
│   │   └── main.tsx              # React entry point
│   ├── public/                   # Static assets
│   ├── .env                      # Frontend environment variables
│   ├── package.json              # Frontend dependencies
│   ├── tsconfig.json             # TypeScript configuration
│   └── vite.config.ts            # Vite build configuration
│
├── backend/                       # Node.js + Express Backend
│   ├── src/
│   │   ├── agents/
│   │   │   ├── agentConfig.ts    # AI agent definitions
│   │   │   └── aiService.ts      # Claude API integration
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript interfaces
│   │   └── index.ts              # Server entry point
│   ├── .env                      # Backend environment variables
│   ├── .env.example              # Environment template
│   ├── package.json              # Backend dependencies
│   ├── tsconfig.json             # TypeScript configuration
│   └── Dockerfile                # Docker container (for deployment)
│
├── infrastructure/                # Terraform for AWS (not needed locally)
│   └── ...
│
├── scripts/                       # Deployment scripts
│   └── ...
│
├── package.json                   # Root workspace configuration
├── README.md                      # Main project documentation
└── CONTRIBUTING.md                # Contributing guidelines
```

### Key Files to Know

**Frontend:**
- `frontend/src/store/useStore.ts` - Agent definitions and state management
- `frontend/src/components/VirtualOffice.tsx` - 3D scene setup
- `frontend/src/components/AgentAvatar.tsx` - Agent 3D models
- `frontend/src/components/ChatBoard.tsx` - Chat interface

**Backend:**
- `backend/src/index.ts` - Server and WebSocket setup
- `backend/src/agents/agentConfig.ts` - Agent personalities and prompts
- `backend/src/agents/aiService.ts` - Claude API integration

---

## Development Workflow

### Making Changes

#### 1. Start Development Servers

```bash
npm run dev
```

#### 2. Make Your Changes

Both frontend and backend support **hot reload**:

- **Frontend:** Changes auto-reload in browser
- **Backend:** Server auto-restarts on file changes (using tsx watch)

#### 3. View Changes

Open http://localhost:5173 in your browser

### Common Development Tasks

#### Add a New AI Agent

**1. Update Backend Configuration** (`backend/src/agents/agentConfig.ts`):

```typescript
{
  id: 'designer',
  name: 'Jamie',
  role: 'Designer',
  description: 'UI/UX design and user experience',
  systemPrompt: `You are Jamie, a senior UX/UI designer...`,
}
```

**2. Update Frontend Store** (`frontend/src/store/useStore.ts`):

```typescript
{
  id: 'designer',
  name: 'Jamie',
  role: 'Designer',
  description: 'UI/UX design and user experience',
  position: [0, 1, 3], // 3D position in space
  color: '#EC4899',    // Pink color
}
```

**3. Test:** Restart servers and check if the new agent appears

#### Modify Agent Positions

Edit `frontend/src/store/useStore.ts`:

```typescript
agents: [
  {
    id: 'ceo',
    name: 'Alex',
    // Change position [x, y, z]
    position: [0, 1, -3], // -3 is further back
    // ...
  }
]
```

#### Customize 3D Room

Edit `frontend/src/components/Room.tsx`:

```typescript
// Change floor color
<meshStandardMaterial color="#1a1a2e" />

// Adjust room size
<planeGeometry args={[30, 30]} /> // 30x30 units
```

#### Modify Chat UI

Edit `frontend/src/components/ChatBoard.tsx` and `ChatBoard.css`

### TypeScript Development

**Type Checking:**
```bash
# Frontend
cd frontend
npm run build  # Runs tsc

# Backend
cd backend
npm run build  # Runs tsc
```

**Linting:**
```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm run lint
```

### Browser Developer Tools

**Recommended Setup:**

1. Open DevTools (F12 or Cmd+Option+I)
2. Check **Console** for errors
3. Check **Network** tab for WebSocket connections
4. Use **React DevTools** extension
5. Enable **Three.js Inspector** for debugging 3D

---

## Testing Your Setup

### 1. Backend Health Check

**Test the API:**
```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{"status":"ok","timestamp":"2024-XX-XXTXX:XX:XX.XXXZ"}
```

### 2. Frontend Loading

1. Open http://localhost:5173
2. You should see:
   - Dark virtual office environment
   - 5 colored spheres (AI agents)
   - "Virtual AI Office" header
   - Instructions to click agents

### 3. WebSocket Connection

**Check browser console:**
```
Connected to server
```

If you see this, WebSocket is working!

### 4. AI Agent Interaction

**Full End-to-End Test:**

1. Click on **Alex (CEO)** - purple sphere
2. Chat board appears on the right
3. Type: "What's our business strategy?"
4. Press Enter or click Send
5. You should see:
   - Your message appears
   - "Typing..." indicator
   - AI response from Claude

**If this works, everything is set up correctly! 🎉**

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Port 3000 already in use"

**Solution 1 - Find and kill process:**
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Solution 2 - Change port:**
```bash
# Edit backend/.env
PORT=3001

# Edit frontend/.env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

#### Issue: "Port 5173 already in use"

**Solution:**
```bash
# Vite will automatically use next available port
# Or specify in vite.config.ts
```

#### Issue: WebSocket Connection Failed

**Symptoms:**
- Chat doesn't work
- Console shows "WebSocket connection failed"

**Solutions:**

1. **Check backend is running:**
```bash
curl http://localhost:3000/health
```

2. **Check CORS configuration:**
```bash
# backend/.env
CORS_ORIGIN=http://localhost:5173  # Must match frontend URL
```

3. **Check firewall:**
- Ensure ports 3000 and 5173 aren't blocked

4. **Restart servers:**
```bash
# Stop (Ctrl+C) and restart
npm run dev
```

#### Issue: "Anthropic API Error" or "401 Unauthorized"

**Symptoms:**
- Agents respond with fallback messages
- Backend logs show API errors

**Solutions:**

1. **Check API key is set:**
```bash
# backend/.env
ANTHROPIC_API_KEY=sk-ant-...  # Should start with sk-ant-
```

2. **Verify API key is valid:**
- Log in to console.anthropic.com
- Check if key is active
- Generate new key if needed

3. **Check API quota:**
- You may have exhausted free credits
- Add payment method or wait for reset

#### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove lock files and node_modules
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
rm -rf backend/node_modules backend/package-lock.json

# Reinstall
npm install
```

#### Issue: TypeScript Errors

**Solution:**
```bash
# Rebuild TypeScript
cd frontend
npm run build

cd ../backend
npm run build
```

#### Issue: 3D Scene Not Rendering

**Symptoms:**
- Blank screen
- No 3D content visible

**Solutions:**

1. **Check browser console for errors**

2. **Try different browser:**
   - Chrome, Firefox, or Edge recommended
   - Safari may have WebGL issues

3. **Check WebGL support:**
   - Visit https://get.webgl.org/
   - Should show spinning cube

4. **Update graphics drivers**

5. **Disable browser extensions that might interfere**

#### Issue: Agents Not Appearing

**Solutions:**

1. **Check agent configuration matches in both files:**
   - `backend/src/agents/agentConfig.ts`
   - `frontend/src/store/useStore.ts`

2. **Check browser console for errors**

3. **Hard refresh:** Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

#### Issue: Hot Reload Not Working

**Frontend:**
```bash
# Restart Vite dev server
cd frontend
npm run dev
```

**Backend:**
```bash
# Check tsx is watching files
cd backend
npm run dev
```

---

## Tips and Best Practices

### Development Tips

1. **Use Two Monitors:** One for code, one for browser
2. **Keep DevTools Open:** Monitor console, network, and React state
3. **Use React DevTools:** Inspect component hierarchy and state
4. **Enable Source Maps:** Already configured for debugging
5. **Use TypeScript Strictly:** Helps catch errors early

### Performance Tips

1. **3D Optimization:**
   - Keep polygon count low for avatars
   - Use simple geometries
   - Limit number of lights

2. **State Management:**
   - Don't over-use global state
   - Memoize expensive computations
   - Use React.memo for heavy components

3. **API Optimization:**
   - Conversation history limited to last 10 messages
   - Implement debouncing for frequent updates

### Security Tips

1. **Never commit `.env` files**
2. **Don't share your API key**
3. **Use environment variables for all secrets**
4. **Rotate API keys regularly**
5. **Keep dependencies updated**

### Code Quality

1. **Run linters before committing:**
```bash
cd frontend && npm run lint
cd backend && npm run lint
```

2. **Format code consistently:**
```bash
# Use Prettier (configure in VSCode)
```

3. **Write meaningful commit messages**

4. **Test changes before pushing**

---

## Next Steps

Once you have everything running locally:

1. **Explore the Code:**
   - Read through component files
   - Understand state management
   - Review agent configurations

2. **Make Small Changes:**
   - Modify agent positions
   - Change colors
   - Adjust room design

3. **Add Features:**
   - New agents
   - Custom 3D models
   - Additional UI elements

4. **Read Documentation:**
   - [Frontend README](frontend/README.md)
   - [Backend README](backend/README.md)
   - [Contributing Guide](CONTRIBUTING.md)

5. **Deploy to AWS** (when ready):
   - [Infrastructure README](infrastructure/README.md)

---

## Getting Help

**Issues?**
- Check console logs (frontend and backend)
- Review this troubleshooting guide
- Check GitHub Issues
- Read component documentation

**Questions?**
- Open an issue on GitHub
- Check CONTRIBUTING.md
- Review inline code comments

---

## Quick Reference

### Common Commands

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Build for production
npm run build

# Clean everything
npm run clean

# Type checking
cd frontend && npm run build
cd backend && npm run build

# Linting
cd frontend && npm run lint
cd backend && npm run lint
```

### URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| WebSocket | ws://localhost:3000 |
| Health Check | http://localhost:3000/health |
| Agents List | http://localhost:3000/api/agents |

### File Locations

| Item | Path |
|------|------|
| Frontend env | `frontend/.env` |
| Backend env | `backend/.env` |
| Agent config | `backend/src/agents/agentConfig.ts` |
| Agent store | `frontend/src/store/useStore.ts` |
| 3D scene | `frontend/src/components/VirtualOffice.tsx` |

---

**Happy Coding! 🚀**

If you successfully see the 3D virtual office and can chat with AI agents, you're all set up for development!
